# ui-divided-box for angularJS


###OVERVIEW

ui-divided-box is a set of AngularJS directives that mimic the [Flex/Actionscript DividedBox](http://help.adobe.com/en_US/flex/using/WS2db454920e96a9e51e63e3d11c0bf69084-7e54.html) containers.  A divided box lays out its children horizontally or vertically, inserting a draggable divider between each child.  Dragging a divider increases or decreases the size of the element to the left in a horizontal divided box, or above in a vertical divided box, and correspondingly takes away or adds to the last element in the list. 

```html
	<ui-divided-box orientation="horizontal" style="width:100%">
		<div min="100" max="200" style="width:150px">one</div>
		<div min="100">two</div>
		<div min="200" max="300">three</div>
		<div min="100">four</div>
	</ui-divided-box>
```
	
creates a horizontal box of four DIVs each separated by a vertical divider.  Drag the divider to resize the boxes.  

You can find examples on the [demo page](http://timfogarty1549.github.io/ui-divided-box/).

###REQUIREMENTS

The full jQuery is required.

###ELEMENTS

	<ui-divided-box orientation="[horizontal|vertical]">[children elements]</ui-divided-box>
	
	<ui-h-divided-box>[children elements]</ui-h-divided-box>

	<ui-v-divided-box>[children elements]</ui-v-divided-box>
	
Horizontal boxes appear as

<table><tr><td>one</td><td>two</td><td>three</td></tr><table>

Vertical boxes appear as 

<table><tr><td>one</td></tr><tr><td>two</td></tr><tr><td>three</td></tr></table>

####Attributes for divided box elements

 + `orientation`: for &lt;ui-divided-box> only.  Indicates layout direction.  If first character is 'h' then the layout is horizontal, otherwise it is vertical.
 + `divider-width`: the width of the divider. Defaults to 3 pixels.
 + `divider-color`: the color of the divider. Defaults to gray.
 + `divider-class`: CSS class to apply to the divider.  Defaults to null.

###Attributes for child elements of divided boxes

 + `min`: minimum size of this child, in pixels, defaults to 10
 + `max`: maximum size of this child, in pixels
 
 Use CSS to set the initial size of the child element.
 
###Installation

 + include ui-divided-box.js
 + add module to angular

```html
	<script type="text/javascript" src="ui-divided-box.js"></script>
	<script type="text/javascript">
		var app = angular.module("myApp", [ 'ui.divided.box' ]);
	</script>
```

###Known Issues

There is an error in calculating the width or height of the last element.  Depending on the width of the outer container, the last element is off between 0 and 3 pixels.

####Future Development

Rather than using a simple background color for the draggable divider, use a repeatable image, or vectors on a canvas.