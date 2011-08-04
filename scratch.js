/*
scratch.js

Please try the following to see what is this for:
  Put this script in the "scripts" folder of Sg.
  Select a grayscale image ,
  and run this script by the triangle button.

tested with Adobe Illustrator CS3 / Mac OSX(10.6.7) / Sg.2.7.037
  
Scriptographer is a plugin for Adobe Illustrator(TM)
created by Juerg Lehni
http://scriptographer.org/


// This code under Creative Common license (CC BY-SA) 
// http://creativecommons.org/licenses/by-sa/2.0/
// It's mean YOU ARE FREE:
//    to share — to copy, distribute and transmit the work, 
//    to remix — to adapt the work
//    to make commercial use of the work


// Script author
Masaki Yamabe(@masakick,masaki@allianceport.jp)

*/




// find all selected images in the document 
var rasters = document.getItems({ 
	type: Raster, 
	selected: true 
});

// check if any images were selected 
if(rasters.length > 0) { 

    //if you want to print the parametesr.
    var printParameter = true;
    
    
    var defaultValues = {
        gridSize: 2,
        maximumInputLevel: 1.0,
        minimumInputLevel: 0.25,
        randomnessPosition:2,
        divergence:2,
        lineLengthType:0,
        lineWidth:0.1
    };

    var components = {
        gridSize: { type: 'number', label: 'Grid Size' },
        maximumInputLevel: { type: 'number', label: 'Maximum Input Level' },
        minimumInputLevel: { type: 'number', label: 'Minimun Input Level' },
        randomnessPosition: { type: 'number', label: 'Randomness(Position)' },
        divergence:{ type: 'number', label: 'Divergence' },
        lineLengthType: { type: 'number', label: 'Line Length Type(0:linear 1:quadratic)' },
        lineWidth: { type: 'number', label: 'LineWidth' }
    };
    
    var values = Dialog.prompt('Please Enter The Parameters', components,defaultValues);

	// get the first raster in the rasters array 
	var raster = rasters[0]; 
	var gridSize = values.gridSize;
    var randomnessPosition  = values.randomnessPosition;
    var minimumInputLevel = values.minimumInputLevel;
    var maximumInputLevel = values.maximumInputLevel;
    var lineWidth = values.lineWidth;
    var divergence = values.divergence;
    var lineLengthType = (values.lineLengthType==0)? 'linear':'quadratic';
    var pointBegin;
    var pointEnd;
    
    var lineStyle ={
        strokeWidth:lineWidth,
        strokeColor:new RGBColor(0,0,0),
        fillColor:null
    }

	for(var x = 0; x < raster.width; x++) { 
		for(var y = 0; y < raster.height; y++) { 
			var color = raster.getPixel(x, y);
            
            if(color.gray>=minimumInputLevel && color.gray<=maximumInputLevel){
                pointBegin = new Point(x+randomnessPosition*(-0.5+Math.random()), y+randomnessPosition*(-0.5+Math.random())) * gridSize;
                if(lineLengthType=="linear"){
                    pointEnd = new Point(x+(divergence*color.gray), y) * gridSize;
                }
                else{
                    pointEnd = new Point(x+(divergence*color.gray*color.gray), y) * gridSize;
                }
                var path = new Path.Line(pointBegin,pointEnd);
                path.scale(color.gray); 
                var rotation = Math.random()*360;
                path.rotate(rotation,pointBegin);
                path.style = lineStyle;
            } 
		} 
	}
    
    if(printParameter){
        var position = new Point(0, raster.height*gridSize+32);
        var textItem = new PointText(position);
        textItem.characterStyle.fontSize = 7;
        textItem.content = 'Grid Size:gridSize:'+gridSize+'/Maximum Input Level:'+maximumInputLevel+'/Minimun Input Level:'+minimumInputLevel+'/Randomness(Position):'+randomnessPosition+'/Divergence:'+divergence+'/Line Length Type:'+lineLengthType;
    }
    
} else { 
	Dialog.alert('Please select an image first!') 
}