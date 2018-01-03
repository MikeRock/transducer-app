import path from "path"
import webpack from "webpack"

export default {
entry: "./src/index.js",
output: {
filename:"bundle.js",
publicPath:"build",
path: path.resolve(__dirname,"./build")    
},
module: {
rules: [
{ test: /\.jsx?$/,
use: "babel-loader",
exclude: /node_modules/
},
{test: /\.css$/,
use: ["style-loader","css-loader"],
exclude: /node_modules/    
}]    
}}