import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import 'rxjs/Rx';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  router: Router;
  isAuth: String;
  currentUrl : String;

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (localStorage.getItem('token') !== null){
        this.isAuth = 'yes';
      }else {
        this.isAuth = 'no';
      }
    });
  }

  private members = 'http://localhost/it255-dz12/getAll.php';
  data: Object[];
  name: String = '';

  constructor (private http: Http, router: Router){
    this.router = router;
    this.currentUrl = '';
    this.http.get(this.members).subscribe(data => {
        this.data =  JSON.parse(data['_body']);
      },
      err => console.log(err.text()), () => {
      }
    );
  }

  public removeMember(event: Event, item: Number) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('token', localStorage.getItem('token'));
    this.http.get('http://localhost/it255-dz12/delete.php?id=' + item, {headers: headers}).subscribe( data => {
      event.srcElement.parentElement.parentElement.remove();
    });
  }

  public vievMember(id: number ) {
    this.router.navigateByUrl('member/' + id);
  }
}
