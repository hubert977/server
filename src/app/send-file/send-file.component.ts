import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import {HttpParams, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-send-file',
  templateUrl: './send-file.component.html',
  styleUrls: ['./send-file.component.scss']
})
export class SendFileComponent implements OnInit {
  
  constructor(private http: HttpClient) { }
  onFileChange(event)
  {
 
    let files;
    files = event.srcElement.files;
    let file = files[0];
    let formData = new FormData(); 
    formData.append('file', file); 
    console.log(formData.get("file"));
    this.http.post('http://localhost:5000/file', formData).subscribe((val) => {
    console.log(val);
});
return false; 
  }

  ngOnInit() {
  }

}
