import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  http: Http;
  router: Router;

  constructor(http: Http,  router: Router) {
    this.http = http;
    this.router = router;
    if(localStorage.getItem('token') != null){
      this.router.navigate(['']);
    }
  }


  onLogin() {
    let data = "username="+this.loginForm.value.username+"&password="+this.loginForm.value.password;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.http.post('http://localhost/it255-dz12/login.php',data, {headers:headers})
      .map(res => res)
      .subscribe( data => {
          let obj = JSON.parse(data["_body"]);
          localStorage.setItem('token', obj.token);
          this.router.navigate(['']);
        },
        err => {
          let obj = JSON.parse(err._body);
          let element = <HTMLElement>document.getElementsByClassName("alert")[0];
          element.style.display = "block";
          element.innerHTML = obj.error.split("\\r\\n").join("<br/>").split("\"").join("");
        }
      );
  }

  ngOnInit() {
  }

}
