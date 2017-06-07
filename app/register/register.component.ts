import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  http: Http;
  router: Router;
  registerForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl()
  });

  constructor(http: Http, router: Router) {
    this.http = http;
    this.router = router;

    if (localStorage.getItem('token') != null) {
      this.router.navigate(['']);
    }

  }
  onRegister() {
    let data = "username="+this.registerForm.value.username+"&password="+this.registerForm.value.password+"&firstName="+this.registerForm.value.firstName+"&lastName="+this.registerForm.value.lastName;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.http.post('http://localhost/it255-dz12/register.php',data, {headers:headers})
      .map(res => res)
      .subscribe( data => {
          console.log(data);
          let obj = JSON.parse(data["_body"]);
          localStorage.setItem('token', obj.token);
          this.router.navigate(['']);
        },
        err => {
          let obj = JSON.parse(err._body);
          let element  = <HTMLElement> document.getElementsByClassName("alert")[0];
          element.style.display = "block";
          element.innerHTML = obj.error.split("\\r\\n").join("<br/>").split("\"").join("");
        }
      );
  }

  ngOnInit() {
  }

}
