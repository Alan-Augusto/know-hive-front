import { Component, signal } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, RouteConfigLoadEnd, Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { filter, map, switchMap } from 'rxjs';
import { MenuService } from '../../components/menu/menu.service';

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
    private menuService: MenuService
  )
  {
    this.router.events.pipe(
      filter(evt => evt instanceof RouteConfigLoadEnd || evt instanceof NavigationEnd)
    )
    .subscribe(data => {
      if (data instanceof RouteConfigLoadEnd) {
        this.showMenu.set(data.route.data?.['showMenu'] != false);
        this.menuService.setActiveMenuItemFromUrl();
      }
      else if (data instanceof NavigationEnd) {
        const route = this.getActivatedRoute();
        this.showMenu.set(route?.snapshot.data?.['showMenu'] != false);
        this.menuService.setActiveMenuItemFromUrl();
      }
    });
  }

  getActivatedRoute() {
    return this.router.routerState.root.firstChild;
  }

}
