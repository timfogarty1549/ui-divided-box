# ui-divided-box


##OVERVIEW

ui-divided-box is a set of AngularJS directives that mimic the Flex/Actionscript DividedBox containers.  A divided box lays out its children horizontally or vertically, inserting a dragable divider between each child.  Dragging a divider increases or decreases the size of the element to the left in a horizontal divided box, or above in a vertical divided box, amd correspondingly takes away or adds to the last element in the list. 

	<ui-divided-box orientation="horizontal" style="width:100%">
		<div min="100" max="200">one</div>
		<div" min="100">two</div>
		<div" min="200" max="300">three</div>
		<div" min="100">four</div>
	</ui-divided-box>
	
creates a horizontal box of four DIVs each seperated by a vertical divider.  Drag the divider to resize the boxes.  

You can find examples on the [demo page](http://timfogarty1549.github.io/ui-divided-box/).

##REQUIREMENTS

The full jQuery is required.

##ELEMENTS

	<ui-divided-box orientation="[horizontal|vertical]">[children elements]</ui-divided-box>
	
	<ui-h-divided-box>[children elements]</ui-h-divided-box>

	<ui-v-divided-box>[children elements]</ui-v-divided-box>

###Attributes for divided box elements

|Param          |Default |
|---------------|--------|
| orientation   |        |
| divider-class |        |
| divider-width | 3      |
| divider-color | gray   |
|---------------|--------|

###Attributes for child elements

 + `min`: minimum size of this child, in pixels, defaults to 10
 + `max`: maximum size of this child, in pixels
 
 Use CSS to set the initial size of the child element.