import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  http: Http;
  router: Router;
  postResponse: Response;
  route: ActivatedRoute;
  data: Object[];

  editMemberForm = new FormGroup({
    ime: new FormControl(),
    prezime: new FormControl()
  });

  constructor(route: ActivatedRoute, http: Http, router: Router) {
    this.http = http;
    this.router = router;
    this.route = route;
    if (localStorage.getItem('token') == null) {
      this.router.navigate(['']);
    }
  }

  ngOnInit() {
  }

  onEditMember() {
    this.route.params.subscribe((params: Params) => {
        const id = params['id'];
        const headers = new Headers();
        const data = 'id=' + id + '&ime=' + this.editMemberForm.value.ime + '&prezime=' + this.editMemberForm.value.prezime;
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('token', localStorage.getItem('token'));
        this.http.post('http://localhost/it255-dz12/editMember.php', data, { headers: headers })
          .map(res => res)
          .subscribe( data => this.postResponse = data,
            err => alert(JSON.stringify(err)), () => {
              if (this.postResponse['_body'].indexOf('error') === -1){
                this.router.navigate(['']);
              }else{
                alert('Doslo je do greske');
              }
            }
          );
      }
    );
  }

}
