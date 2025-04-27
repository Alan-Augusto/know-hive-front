import { Component, signal } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, RouteConfigLoadEnd, Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'layout',
  imports: [
    RouterOutlet,
    MenuComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  showMenu = signal(false);

  constructor(
    private router: Router,
  )
  {
    this.router.events.pipe(
      filter(evt => evt instanceof RouteConfigLoadEnd)
    )
    .subscribe(data => {
      this.showMenu.set(data.route.data?.['showMenu'] != false);
      console.log('showMenu', this.showMenu());
    });
  }

}
