var canvas, ctx;
var unit_vh;

var htmlToImage = require('html-to-image');

function cardGeneratorOnload() {
    canvas = document.getElementById('ExporterCanvas');
    unit_vh = window.innerHeight / 100;
    canvas.width = unit_vh * 75;
    canvas.height = unit_vh * 100;
    ctx = canvas.getContext('2d');

    DataHandler.loadAllData();
    exportImage("condense_light");
    // document.body.appendChild(CardHandler.generateRawCardElement(new Card("condense_light").type));
}
function exportImage(cardId = "condense_light") {
    let elem = CardHandler.generateRawCardElement(new Card("condense_light").type);
    htmlToImage.toPng(elem);
    
//     let data = `
//     <svg xmlns="http://www.w3.org/2000/svg" width="${unit_vh * 75}" height="${unit_vh * 100}">
//         <foreignObject width="100%" height="100%">
//             <div xmlns="http://www.w3.org/1999/xhtml">
//                 ${elem.outerHTML}
//             </div>
//         </foreignObject>
//     </svg>
//     `;

// //     var data   = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
// //     '<foreignObject width="100%" height="100%">' +
// //       '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
// //         '<em>I</em> like <span style="color:white; text-shadow:0 0 2px blue;">cheese</span>' +
// //       '</div>' +
// //     '</foreignObject>' +
// //   '</svg>';
    
//     var DOMURL = window.URL || window.webkitURL || window;

//     var img = new Image();
//     var svg = new Blob([data], {type:'image/svg+xml;charset=utf-8'});
//     var url = DOMURL.createObjectURL(svg);

//     img.onload = ()=>{
//         //debug
//         // ctx.beginPath();
//         // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
//         // ctx.fillStyle = "orange";
//         // ctx.fill();

//         //draw image
//         ctx.drawImage(img, 0, 0);
//         console.log(img);
//         DOMURL.revokeObjectURL(url);
//     }


//     img.src = url;
}