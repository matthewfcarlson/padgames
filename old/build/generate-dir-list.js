const fs = require('fs');
module.exports = function(dir, outputFile) {
    var output = "[\n";
    //console.log("Reading ",dir);
    //console.log("Outputting to ",dir);
    var allowedEnding = [".png",".jpg",".jpeg"];
    var files = fs.readdirSync(dir).forEach(file=>{
        var file_lower = file.toLowerCase();
        
        var match = allowedEnding.some( x=> {
            return file_lower.endsWith(x);
        });
        if (!match) {
            console.log("Skipping ",file);
            return;
        }
        output += "\t\"" + file+"\",\n";
    });
    output = output.slice(0,-2)+"\n]";
    fs.writeFile(outputFile, output, (err)=> {
        if (err) throw err;
        console.log("Saved directory file to ", outputFile);
    } )
}