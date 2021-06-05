import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UsersService } from 'src/app/services/users.service';

const URL= 'http://localhost:3000/api/chatapp/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  selectedFile : any;

  constructor( private userService : UsersService) { }

  ngOnInit(): void {
  }

  OnFileSelected(event: any){
    const file : File = event[0];

    this.ReadAsBase64(file).then(result => {
        this.selectedFile = result;
    }).catch(err => console.log(err));

  }

  Upload(){
    if(this.selectedFile){
      this.userService.AddImage(this.selectedFile).subscribe(data => {
        console.log(data);
        const filePath = <HTMLInputElement>document.getElementById(`filePath`);
        filePath.value= '';
      },
      err => console.log(err)
      );
    }
  }

  ReadAsBase64(file: any) : Promise<any>{
    const reader= new FileReader();
    const fileValue = new Promise((resolve , reject) => {
        reader.addEventListener('load',() => {
          resolve(reader.result);
        });

        reader.addEventListener('error', (event) => {
          reject(event);
        });

        reader.readAsDataURL(file);
    })

    return fileValue;
  }

}
