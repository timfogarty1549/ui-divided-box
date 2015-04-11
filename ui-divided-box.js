'use strict';

var __ui_divider_counter = 0;

var Uidb = {
//		Replace element with it's first child
		replaceWithChild : function(element, child) {
			if( child == undefined ) child = element[0].firstChild;
			var newElement = angular.element(child);
			Uidb.mergeAttributes(element, newElement);
			element.replaceWith(newElement);
		},
//		Copy attributes from sourceElement to targetElement, merging their values if the attribute is already present
		mergeAttributes : function(sourceElement, targetElement) {
			var arr = sourceElement[0].attributes;
			for(var i = 0; i < arr.length; i++) {
				var item = arr[i];
				if(!item.specified)
					continue;

				var key = item.name;
				var sourceVal = item.value;
				var targetVal = targetElement.attr(key);
				if(sourceVal === targetVal)
					continue;
				if( key == 'style' ) sourceVal += ';';	// not ending value of style attribute with ; causes corrupted value when appended
				var newVal = targetVal === undefined ? sourceVal : sourceVal + ' ' + targetVal;
				targetElement.attr(key, newVal);
			}
		}
};


angular.module('ui.divided.box', [])

.controller( 'uiDividedBoxController' , ['$scope', '$attrs', '$window', function ($scope, $attrs, $window ) {

	var findNode = function( attr, tag, defVal ) {
		for( var i=0; i< attr.length; i++ ) {
			if( attr[i].nodeName == tag ) {
				return attr[i].nodeValue == '' ? defVal : attr[i].nodeValue;
			}
		}
		return defVal;
	};

	this.container = '';
	this.containerSize = function() { 
		return this.isHorizontal ? this.container.width() : this.container.height();
	};

	this.items = [];
	this.isHorizontal = $attrs.orientation.charAt(0) == 'h';

	this.addItem = function ( item, divider ) {
		if( divider != undefined ) {
			divider.resizerWidth = parseInt( findNode( divider[0].attributes, 'resizer-width' ) );
			divider.offset = this.items.length;
		}
		item.min = parseInt(findNode( item[0].attributes, 'min', 10 ) );
		item.max = parseInt(findNode( item[0].attributes, 'max', 99999 ) );
		item.divider = divider;
		item.marginWidth = 0;
		this.items.push( item );
	};

	this.removeItems = function() {
		this.items = [];
	};

	this.totalSize = function( includeLastMin ) {
		var totalSize = 0;
		var m1, m2;
		for( var i=0; i<this.items.length-1; i++ ) {
			var item = this.items[i];
			if( this.isHorizontal ) {
				m1 = item[0].style.marginLeft ? parseInt(item[0].style.marginLeft) : 0;
				m2 = item[0].style.marginRight ? parseInt(item[0].style.marginRight) : 0;
				totalSize += item[0].offsetWidth + m1 + m2 + item.divider[0].offsetWidth;
			} else {
				m1 = item[0].style.marginTop ? parseInt(item[0].style.marginTop) : 0;
				m2 = item[0].style.marginBottom ? parseInt(item[0].style.marginBottom) : 0;
				totalSize += item[0].offsetHeight + m1 + m2 + item.divider[0].offsetHeight;
			}
			item.marginWidth = m1 + m2;
		}
		item = this.items[i]
		m1 = item[0].style.marginLeft ? parseInt(item[0].style.marginLeft) : 0;
		m2 = item[0].style.marginRight ? parseInt(item[0].style.marginRight) : 0;
		item.marginWidth = m1 + m2;
		if( includeLastMin ) {
//			m1 = item[0].style.paddingLeft ? parseInt(item[0].style.paddingLeft) : 0;
//			m2 = item[0].style.paddingRight ? parseInt(item[0].style.paddingRight) : 0;
			totalSize += item.min + item.marginWidth;
		}
		return totalSize;
	};

	this.setLastItem = function() {		// set last item to rest of container
		var item = this.items[this.items.length-1];
		/**
		 * something is not being calculated correctly.  off by plus or minus 1. depends on outer container dimension.
		 * but haven't been able to predict which one will be.
		 * If 1px to small, then last item not drawn.  
		 * If 1 pix too big then get space between borders
		 */
		var lastBorderWidth = this.isHorizontal ? 
				item[0].offsetWidth - item.width() - item.marginWidth + 1 :
				item[0].offsetHeight - item.height() - item.marginWidth - 4;
		var w = this.containerSize() - this.totalSize( false ) - lastBorderWidth + (this.items.length-3)*6;		// this last term is a hack
		if( w < item.min ) w = item.min;
		else if( w > item.max ) w = item.max;
		item.css( this.isHorizontal ? {'width': w+"px"} : {"height": w+'px'} );
	}

	this.initSizes = function( element ) {
		if( element ) this.container = element;
		for( var i=0; i< this.items.length-1; i++ ) {
			var item = this.items[i];
			if( this.isHorizontal ) {
				var w = item.width();
				if( w < item.min ) {
					item.css( {'width': item.min+"px"} );
				} else if( w > item.max ) {
					item.css( {'width': item.max+"px"} );
				}
			} else {
				var h = item.height();
				if( h < item.min ) {
					item.css( {'height': item.min+"px"} );
				} else if( h > item.max ) {
					item.css( {'height': item.max+"px"} );
				}
			}
		}
		this.setLastItem();
		this.setDividerPositions();
	};

	this.setDividerPositions = function() {
		var x, y;
		for( var i=0; i< this.items.length-1; i++ ) {
			var divider = this.items[i].divider;
			var item = this.items[i+1];
			if( this.isHorizontal ) {			// set x or y and width or height of each
				x = item.prop('offsetLeft') - divider.resizerWidth;
				divider.css( 'left', x+"px" );
			} else {
				y = item.prop('offsetTop') - divider.resizerWidth;
				divider.css( 'top', y+"px" );
			}
		}
	};

	this.findItemFromDivider = function( divider ) {
		for( var i=0; i< this.items.length-1; i++ ) {
			if( this.items[i].divider[0] === divider[0] ) return this.items[i];
		}
	}

	this.moveDivider = function( divider, event ) {
		var cursorPosition = this.isHorizontal ? event.pageX : event.pageY;
		var item = this.findItemFromDivider( divider );
		var offset = this.isHorizontal ? item.offset().left : item.offset().top;
		var w = cursorPosition - offset - 2;
		if( item.max && w > item.max) w = item.max;
		if( item.min && w < item.min ) w = item.min;
		var itemSize = this.isHorizontal ? item.width() : item.height();
		if(  this.totalSize( true ) + w - itemSize < this.containerSize() ) {
			item.css( this.isHorizontal ? { width: w + 'px' } : { height:w+'px' } );
		}
		this.setLastItem();
		this.setDividerPositions();
	};

	this.setDividerSizes = function(event, args) {
		if( this.container ) this.initSizes();
	}

	$scope.$on('$destroy', this.removeItems );
	angular.element($window).on('resize', this.setDividerSizes.bind(this) );
}])

/**
 *  a horizontal divided box is div1 | div2 | div3 | etc
 */

.directive('uiHDividedBox', function() {
	return {
		restrict: 'EA',
		transclude: true,
		scope: {
			dividerClass: '@',
			dividerWidth: '@'
		},
		template: "<ui-divided-box orientation='horizontal' divider-class='{{dividerClass}}'><ng-transclude/></ui-divided-box>",
		compile: function() {
			return function postCompile(scope, element, attr) {
				Uidb.replaceWithChild(element)
			};
		}
	}
})

/**
 * a vertical divided box is
 * div1
 * ----
 * div2
 * ----
 * div3
 * ----
 * etc
 */
.directive('uiVDividedBox', function() {
	return {
		restrict: 'EA',
		transclude: true,
		scope: {
			dividerClass: '@',
			dividerWidth: '@'
		},
		template: "<ui-divided-box orientation='vertical' divider-class='{{dividerClass}}'><ng-transclude/></ui-divided-box>",
		compile: function( element, attr ) {
			return function postCompile(scope, element, attr) {		// not sure about this.  compile only performed once.  need to do it for each instance
				Uidb.replaceWithChild(element)
			};
		}
	}
})

.directive('uiDividedBox', [ '$compile', function( $compile ) {
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		template: "<div style='position:relative;'><ng-transclude/></div>",
		scope: {
			orientation: '@',
			dividerWidth: '@',
			dividerClass: '@',
			dividerColor: '@',
			isDisabled: '=?'
		},
		controller: 'uiDividedBoxController',
		link: function( scope, element, attrs, ctrl ) {
			var isHorizontal = scope.orientation.charAt(0) == 'h';
			element.css( { position:'relative' } );
			scope.boxCtrl = ctrl;
			var w = scope.resizerWidth;
			if( w == undefined || w == 0 ) w = 6;
			var spacer = isHorizontal ? { marginLeft: w+'px' } : { marginTop: w+'px' };
			var child = element[0];
			while( child.childElementCount == 1 ) {
				child = child.firstChild;
			}
			child = angular.element( child );
			var divClass = scope.dividerClass ? " class='"+scope.dividerClass+"'" : "";
			var children = child.children();
			var newDiv = $compile("<div style='position:absolute; width:100%; height:100%; overflow:hidden'></div>")(scope);
			for( var i=0; i<children.length; i++ ) {	// make sure each child has an id
				var el = angular.element( children[i] );
//				if( el[0].id == '' ) el[0].id = 'ui-divider-item-'+(__ui_divider_counter++);
				if( isHorizontal ) el.css( 'float', 'left' );
				newDiv.append( el );
			}
			var el0 = angular.element( children[0] );
			for( var i=1; i<children.length; i++ ) {
				var el1 = angular.element( children[i] );
				el1.css( spacer );
				var divider = "<div ui-divider-resizer='"+scope.orientation+"' resizer-width='"+w+"'"+divClass+"></div>";
				var divider_el = $compile(divider) (scope);
				ctrl.addItem( el0, divider_el )
				newDiv.append( divider_el );
				el0 = el1;
			}
			ctrl.addItem( el1 );		// add last item
			angular.element( element[0].firstChild ).replaceWith( newDiv );
			scope.boxCtrl.initSizes( element );
			var watcher = scope.$watch( '__height', function() {
				ctrl.initSizes();
				watcher();
			});
		}
	};
}])

/**
 * the element that is dragged
 */
.directive('uiDividerResizer', [ '$document', function($document) {
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs, controllers ) {
			var style = {
					position: "absolute",
			};
			if( !$attrs.hasOwnProperty( 'class' ) ) style.backgroundColor = 'gray';
			var isHorizontal = $attrs.uiDividerResizer.charAt(0) == 'h';
			if( isHorizontal ) {
				style.cursor = "ew-resize";
				style.width = $attrs.resizerWidth+"px";
				style.top = 0;
				style.bottom = 0;
			} else {
				style.cursor = "ns-resize";
				style.height = $attrs.resizerWidth+"px";
				style.left = 0;
				style.right = 0;
			}
			$element.css( style );

			$element.on('mousedown', function(event) {
				event.preventDefault();
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				$scope.boxCtrl.moveDivider( $element, event );
			}

			function mouseup() {
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}
		}
	};
}])
;
