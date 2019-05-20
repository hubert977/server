import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-send-file',
  templateUrl: './send-file.component.html',
  styleUrls: ['./send-file.component.scss']
})
export class SendFileComponent implements OnInit {
  form: FormGroup;
  fileToUpload
  constructor(private http: HttpClient) { }
  onFileChange(files: FileList)
  {
    this.fileToUpload = files.item(0); 
    let formData = new FormData(); 
  formData.append('file', this.fileToUpload, this.fileToUpload.name); 
  this.http.post('http://localhost:5000', formData).subscribe((val) => {

console.log(val);
});
return false; 
  }
  ngOnInit() {
  }

}
