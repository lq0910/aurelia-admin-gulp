
/**
 * 设置systemjs的config.js 如下：
 * System.config({
  baseURL: ".",
  meta: {
    'xlsx': {
      exports: 'XLSX' // <-- tell SystemJS to expose the XLSX variable
    }
  },
  paths: {
    "github:*": "../jspm_packages/github/*",
    "npm:*": "../node_modules/*",
    "src": "./src"
  },
  map: {
    "xlsx": "../node_modules/xlsx/dist/xlsx.core.min.js",
    "file-saver":"../node_modules/file-saver/FileSaver.min.js"
  },
  packages: {
    'src': { defaultExtension: "js" },
    'test': { defaultExtension: "js" }
  }

});


 */
import * as XLSX from 'xlsx';
import * as saveAs from 'file-saver'

export class XlsxUtils {
  export_xlsx(filename: string, data: Array<any>) {

    var ws = XLSX.utils.aoa_to_sheet(data)
    /* generate workbook and add the worksheet */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);

    /* save to file */
    const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)]), filename + '.xlsx');

  }
  load_xlsx(file: File, success) {
    var reader = new FileReader();
    console.log("载入文件：" + file.name);

    reader.addEventListener("load", (e: any) => {
      let obj = this.readXlsx(e);
      success(obj)
    });
    reader.readAsBinaryString(file);
  }
  private s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  private readXlsx(e: any): Array<any> {
    var data = e.target.result;
    console.log(XLSX);

    var wb = XLSX.read(data, { type: 'binary' });
    console.log(wb);
    var first_sheet_name = wb.SheetNames[0];

    var sheet = wb.Sheets[first_sheet_name];
    console.log(sheet);
    //var roa: Array<any> = XLSX.utils.sheet_to_row_object_array(sheet);
    //var csv: string = XLSX.utils.sheet_to_csv(sheet)
    //this.parseData(csv)
    return XLSX.utils.sheet_to_json(sheet, {})
  }
}