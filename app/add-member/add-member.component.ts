import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  http: Http;
  router: Router;
  postResponse: Response;
  addMemberForm = new FormGroup({
    ime: new FormControl(),
    prezime: new FormControl()
  });

  constructor(http: Http, router: Router) {
    this.http = http;
    this.router = router;
    if (localStorage.getItem('token') == null){
      this.router.navigate(['']);
    }
  }
  onAdd() {
    const data = 'ime=' + this.addMemberForm.value.ime + '&prezime=' + this.addMemberForm.value.prezime;
    const headers = new Headers();
    console.log(data);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('token', localStorage.getItem('token'));
    this.http.post('http://localhost/it255-dz12/dodajClana.php', data, { headers: headers })
      .map(res => res)
      .subscribe( data => this.postResponse = data,
        err => alert(JSON.stringify(err)), () => {
          if (this.postResponse['_body'].indexOf('error') === -1){
            this.router.navigate(['']);
          }else{
           console.log('greska');
          }
        }
      );
  }
  ngOnInit() {
  }

}
