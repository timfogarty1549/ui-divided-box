# ui-divided-box


OVERVIEW

ui-divided-box is a set of AngularJS directives that mimic the Flex/Actionscript DividedBox containers.  A divided box creates a divider between each child.  Move the dividers to resize the child element to the left (or above) of the element..

	<ui-h-divided-box style="width:100%">
		<div min="100" max="200">one</div>
		<div" min="100">two</div>
		<div" min="200" max="300">three</div>
		<div" min="100">four</div>
	</ui-h-divided-box>
	
creates a horizontal box of four DIVs each seperated by a vertical divider.  Drag the divider to resize the boxes.  A divider increases the size of the element to the left (above in a vertical divider) and takes away from the last element in the list. 