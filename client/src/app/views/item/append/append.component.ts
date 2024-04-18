import { Component, OnInit } from '@angular/core';
import { formatDate } from "@angular/common";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment"

export interface File{
  name: string;
  date: string;
  type: string;
  content: any;
}


@Component({
  selector: 'app-append',
  templateUrl: './append.component.html',
  styleUrls: ['./append.component.css']
})
export class AppendComponent implements OnInit {

  type: string = "Image";
  loading: boolean = false;
  uploaded: boolean = false;
  files: any = [];
  percent: number = 0;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(breakpointObserver: BreakpointObserver, private _formBuilder: FormBuilder) {

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }


  onChangeUpload(event: any) {
    this.loading = true;
    let nbFiles = this.files.length + event.target.files.length;
    let self = this;
    [].forEach.call(event.target.files, function(file): void {
      self.loading = true;
      let reader = new FileReader();

      reader.addEventListener("load", function(): void {
        let f: File = {
          name: file['name'],
          date: formatDate(file['lastModifiedDate'], "YYYY-MM-dd hh:mm:ss", environment.timezone),
          type: self.type,
          content: this.result
        };

        self.files.push(f);
        self.percent = self.files.length * 100 / nbFiles;
        if(self.percent==100){
          self.loading = false;
          self.uploaded = true;
        }
        console.log(f);
      }, false);

      reader.readAsDataURL(file);

/*      this.fileUploadService.upload(file).subscribe(
        (event: any) => {
          if (typeof (event) === 'object') {
            this.shortLink = event.link;
            this.loading = false;
            console.log(event.link);
          }
        }
      );*/
    });
  }

  onClickUpload(type: string){
    let elt: any = document.getElementById("file_"+type);
    elt.click();
  }

  ngOnInit(): void {
  }

}
