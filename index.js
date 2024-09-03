import axios from "axios";
import {load} from "cheerio";
import xlsx from "xlsx";
import fs from "fs";



const fileName = "./file.txt"

// const url = "https://www.amazon.in/s?k=phone&crid=1DWUERXG5HK1Q&sprefix=phone%2Caps%2C304&ref=nb_sb_noss_1r.in/"
const url = "https://www.amazon.in/s?k=phone&crid=1N2NIF1IRQF94&sprefix=pho%2Caps%2C316&ref=nb_sb_noss_2"

async function dataScraping(){
    try {
        const res = await axios.get(url)
        writeData(fileName,res.data)

        let finalData = readData(fileName);
        const html = finalData
        const j$ = load(html)
        const data = [];
        const phone = j$('[data-component-type="s-search-result"]')

        phone.each((_,el)=>{
            const container = j$(el)
            const name = container.find('h2').text()
            const price = container.find('.a-price').text()
            const rating = container.find('.a-icon.a-icon-star-small.a-star-small-4.aok-align-bottom').text()
            
            data.push([
                name,
                price,
                rating,
                "available"
            ])
        })
        const workbook=xlsx.utils.book_new();
        const sheet=xlsx.utils.aoa_to_sheet(data);
 
        xlsx.utils.book_append_sheet(workbook,sheet,'Scraped Data');
 
        xlsx.writeFile(workbook,"scrapedData.xlsx");
    } catch (error) {
        console.log(error);
        
    }
}

function writeData(fileName,dataInput){
    try {
        let jsonFile = JSON.stringify(dataInput)
        fs.writeFileSync(fileName, jsonFile)

    } catch (error) {
        console.log(error);
    }
}

function readData(fileName){
    try {
        const fileContent = fs.readFileSync(fileName, 'utf8');

        const dataOutput = JSON.parse(fileContent);

        return dataOutput;
        
    } catch (error) {
        console.log(error);
    }
}
dataScraping();