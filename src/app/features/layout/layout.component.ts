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
      filter(evt => evt instanceof RouteConfigLoadEnd || evt instanceof NavigationEnd)
    )
    .subscribe(data => {
      if (data instanceof RouteConfigLoadEnd) {
        this.showMenu.set(data.route.data?.['showMenu'] != false);
      } else if (data instanceof NavigationEnd) {
        const route = this.getActivatedRoute();
        this.showMenu.set(route?.snapshot.data?.['showMenu'] != false);
      }
      console.log('showMenu', this.showMenu());
    });
  }
  getActivatedRoute() {
    return this.router.routerState.root.firstChild;
  }

}
