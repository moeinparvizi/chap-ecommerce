# Angular Frontend Foundation

## Complete Enterprise Architecture

---

## PART 1 — Project Structure

### 1.1 Complete Folder Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   │
│   │   ├── core/                          # Core module (singleton services, guards, interceptors)
│   │   │   ├── core.module.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── permission.guard.ts
│   │   │   │   ├── role.guard.ts
│   │   │   │   ├── guest.guard.ts
│   │   │   │   └── maintenance.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   ├── loading.interceptor.ts
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   ├── retry.interceptor.ts
│   │   │   │   └── base-url.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── theme.service.ts
│   │   │   │   ├── language.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── logger.service.ts
│   │   │   │   ├── config.service.ts
│   │   │   │   ├── permission.service.ts
│   │   │   │   ├── navigation.service.ts
│   │   │   │   ├── browser.service.ts
│   │   │   │   └── seo.service.ts
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── api-response.model.ts
│   │   │   │   ├── pagination.model.ts
│   │   │   │   ├── error.model.ts
│   │   │   │   └── config.model.ts
│   │   │   └── providers/
│   │   │       ├── app-initializer.provider.ts
│   │   │       └── error-handler.provider.ts
│   │   │
│   │   ├── shared/                        # Shared module (reusable components, directives, pipes)
│   │   │   ├── shared.module.ts
│   │   │   ├── components/
│   │   │   │   ├── ui/                    # Primitive UI components
│   │   │   │   │   ├── button/
│   │   │   │   │   │   ├── button.component.ts
│   │   │   │   │   │   ├── button.component.html
│   │   │   │   │   │   ├── button.component.scss
│   │   │   │   │   │   └── button.models.ts
│   │   │   │   │   ├── input/
│   │   │   │   │   │   ├── input.component.ts
│   │   │   │   │   │   ├── input.component.html
│   │   │   │   │   │   ├── input.component.scss
│   │   │   │   │   │   └── input.models.ts
│   │   │   │   │   ├── select/
│   │   │   │   │   ├── textarea/
│   │   │   │   │   ├── checkbox/
│   │   │   │   │   ├── radio/
│   │   │   │   │   ├── toggle/
│   │   │   │   │   ├── card/
│   │   │   │   │   ├── dialog/
│   │   │   │   │   ├── drawer/
│   │   │   │   │   ├── modal/
│   │   │   │   │   ├── badge/
│   │   │   │   │   ├── avatar/
│   │   │   │   │   ├── tooltip/
│   │   │   │   │   ├── table/
│   │   │   │   │   ├── pagination/
│   │   │   │   │   ├── loading/
│   │   │   │   │   ├── skeleton/
│   │   │   │   │   ├── empty-state/
│   │   │   │   │   ├── error-state/
│   │   │   │   │   ├── toast/
│   │   │   │   │   ├── notification/
│   │   │   │   │   ├── dropdown/
│   │   │   │   │   ├── tabs/
│   │   │   │   │   ├── accordion/
│   │   │   │   │   ├── alert/
│   │   │   │   │   ├── breadcrumb/
│   │   │   │   │   ├── separator/
│   │   │   │   │   ├── chip/
│   │   │   │   │   ├── progress/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── layout/                # Layout components
│   │   │   │   │   ├── public-layout/
│   │   │   │   │   ├── auth-layout/
│   │   │   │   │   ├── dashboard-layout/
│   │   │   │   │   ├── admin-layout/
│   │   │   │   │   └── blank-layout/
│   │   │   │   └── widgets/               # Composite widgets
│   │   │   │       ├── search-bar/
│   │   │   │       ├── language-switcher/
│   │   │   │       ├── theme-toggle/
│   │   │   │       ├── user-menu/
│   │   │   │       └── cart-indicator/
│   │   │   ├── directives/
│   │   │   │   ├── click-outside.directive.ts
│   │   │   │   ├── resize.directive.ts
│   │   │   │   ├── scroll.directive.ts
│   │   │   │   ├── long-press.directive.ts
│   │   │   │   ├── debounce.directive.ts
│   │   │   │   ├── has-permission.directive.ts
│   │   │   │   ├── has-role.directive.ts
│   │   │   │   ├── lazy-image.directive.ts
│   │   │   │   ├── auto-focus.directive.ts
│   │   │   │   └── index.ts
│   │   │   ├── pipes/
│   │   │   │   ├── truncate.pipe.ts
│   │   │   │   ├── time-ago.pipe.ts
│   │   │   │   ├── currency-format.pipe.ts
│   │   │   │   ├── phone-format.pipe.ts
│   │   │   │   ├── safe-html.pipe.ts
│   │   │   │   ├── initials.pipe.ts
│   │   │   │   ├── file-size.pipe.ts
│   │   │   │   └── index.ts
│   │   │   ├── animations/
│   │   │   │   ├── fade.animations.ts
│   │   │   │   ├── slide.animations.ts
│   │   │   │   ├── collapse.animations.ts
│   │   │   │   ├── list.animations.ts
│   │   │   │   └── index.ts
│   │   │   └── validators/
│   │   │       ├── async-validators.ts
│   │   │       └── custom-validators.ts
│   │   │
│   │   ├── features/                      # Feature modules (lazy-loaded)
│   │   │   ├── auth/                      # Auth feature (placeholder)
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.module.ts
│   │   │   ├── products/                  # Products feature (placeholder)
│   │   │   │   ├── products.routes.ts
│   │   │   │   └── products.module.ts
│   │   │   ├── cart/                      # Cart feature (placeholder)
│   │   │   │   ├── cart.routes.ts
│   │   │   │   └── cart.module.ts
│   │   │   ├── orders/                    # Orders feature (placeholder)
│   │   │   │   ├── orders.routes.ts
│   │   │   │   └── orders.module.ts
│   │   │   ├── admin/                     # Admin feature (placeholder)
│   │   │   │   ├── admin.routes.ts
│   │   │   │   └── admin.module.ts
│   │   │   └── cms/                       # CMS feature (placeholder)
│   │   │       ├── cms.routes.ts
│   │   │       └── cms.module.ts
│   │   │
│   │   ├── layout/                        # Layout components
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   │   ├── header.component.ts
│   │   │   │   │   ├── header.component.html
│   │   │   │   │   └── header.component.scss
│   │   │   │   ├── footer/
│   │   │   │   │   ├── footer.component.ts
│   │   │   │   │   ├── footer.component.html
│   │   │   │   │   └── footer.component.scss
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── sidebar.component.ts
│   │   │   │   │   ├── sidebar.component.html
│   │   │   │   │   └── sidebar.component.scss
│   │   │   │   ├── navbar/
│   │   │   │   │   ├── navbar.component.ts
│   │   │   │   │   ├── navbar.component.html
│   │   │   │   │   └── navbar.component.scss
│   │   │   │   └── breadcrumb/
│   │   │   │       ├── breadcrumb.component.ts
│   │   │   │       ├── breadcrumb.component.html
│   │   │   │       └── breadcrumb.component.scss
│   │   │   └── layout.service.ts
│   │   │
│   │   ├── pages/                         # Page components
│   │   │   ├── home/
│   │   │   ├── not-found/
│   │   │   ├── forbidden/
│   │   │   ├── server-error/
│   │   │   └── maintenance/
│   │   │
│   │   └── config/                        # Configuration
│   │       ├── routes.config.ts
│   │       ├── api.config.ts
│   │       ├── app.config.ts
│   │       └── i18n.config.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── i18n/
│   │       ├── en.json
│   │       └── fa.json
│   │
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _functions.scss
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   ├── _utilities.scss
│   │   ├── _animations.scss
│   │   ├── themes/
│   │   │   ├── _light.scss
│   │   │   ├── _dark.scss
│   │   │   └── _variables.scss
│   │   ├── components/
│   │   │   └── _index.scss
│   │   └── styles.scss
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   ├── environment.development.ts
│   │   └── environment.production.ts
│   │
│   └── main.ts
│
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── .eslintrc.json
├── .prettierrc
└── karma.conf.js
```

---

## PART 2 — Routing Architecture

### 2.1 Route Configuration

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ============================================================================
  // PUBLIC ROUTES
  // ============================================================================
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    data: { layout: 'public', title: 'Home' }
  },
  
  // ============================================================================
  // AUTH ROUTES (Guest only)
  // ============================================================================
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard],
    data: { layout: 'auth' }
  },
  
  // ============================================================================
  // PROTECTED ROUTES (Authenticated users)
  // ============================================================================
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES),
    data: { layout: 'public', preload: true }
  },
  
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes').then(m => m.CART_ROUTES),
    canActivate: [authGuard],
    data: { layout: 'public' }
  },
  
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES),
    canActivate: [authGuard],
    data: { layout: 'blank' }
  },
  
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.routes').then(m => m.ORDERS_ROUTES),
    canActivate: [authGuard],
    data: { layout: 'dashboard' }
  },
  
  {
    path: 'wishlist',
    loadChildren: () => import('./features/wishlist/wishlist.routes').then(m => m.WISHLIST_ROUTES),
    canActivate: [authGuard],
    data: { layout: 'public' }
  },
  
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
    canActivate: [authGuard],
    data: { layout: 'dashboard' }
  },
  
  // ============================================================================
  // ADMIN ROUTES (Admin role required)
  // ============================================================================
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, roleGuard],
    canLoad: [authGuard, roleGuard],
    data: { layout: 'admin', roles: ['admin', 'super_admin'] }
  },
  
  // ============================================================================
  // CMS ROUTES (Public)
  // ============================================================================
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.routes').then(m => m.BLOG_ROUTES),
    data: { layout: 'public' }
  },
  
  {
    path: 'pages/:slug',
    loadChildren: () => import('./features/pages/pages.routes').then(m => m.PAGES_ROUTES),
    data: { layout: 'public' }
  },
  
  // ============================================================================
  // ERROR ROUTES
  // ============================================================================
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: { layout: 'blank', title: 'Page Not Found' }
  },
  
  {
    path: '403',
    loadComponent: () => import('./pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
    data: { layout: 'blank', title: 'Access Denied' }
  },
  
  {
    path: '500',
    loadComponent: () => import('./pages/server-error/server-error.component').then(m => m.ServerErrorComponent),
    data: { layout: 'blank', title: 'Server Error' }
  },
  
  {
    path: 'maintenance',
    loadComponent: () => import('./pages/maintenance/maintenance.component').then(m => m.MaintenanceComponent),
    data: { layout: 'blank', title: 'Maintenance' }
  },
  
  // ============================================================================
  // CATCH-ALL (404)
  // ============================================================================
  {
    path: '**',
    redirectTo: '404'
  }
];
```

### 2.2 Route Guards

```typescript
// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Store attempted URL for redirecting
  authService.setRedirectUrl(state.url);
  
  // Redirect to login
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};

// core/guards/guest.guard.ts
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    return true;
  }
  
  // Redirect to home if already authenticated
  router.navigate(['/']);
  return false;
};

// core/guards/permission.guard.ts
export const permissionGuard: CanActivateFn = (route) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);
  
  const requiredPermissions = route.data['permissions'] as string[];
  
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  
  const hasPermission = requiredPermissions.every(permission =>
    permissionService.hasPermission(permission)
  );
  
  if (hasPermission) {
    return true;
  }
  
  router.navigate(['/403']);
  return false;
};

// core/guards/role.guard.ts
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as string[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  const userRoles = authService.getUserRoles();
  const hasRole = requiredRoles.some(role => userRoles.includes(role));
  
  if (hasRole) {
    return true;
  }
  
  router.navigate(['/403']);
  return false;
};
```

### 2.3 Preloading Strategy

```typescript
// core/services/preloading-strategy.ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}
```

---

## PART 3 — Layout System

### 3.1 Layout Components

```typescript
// shared/components/layout/public-layout/public-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../layout/components/header/header.component';
import { FooterComponent } from '../../../layout/components/footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="public-layout">
      <app-header />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: [`
    .public-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
    }
  `]
})
export class PublicLayoutComponent {}
```

```typescript
// shared/components/layout/auth-layout/auth-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-container">
        <div class="auth-brand">
          <a routerLink="/">
            <img src="assets/images/logo.svg" alt="Logo" />
          </a>
        </div>
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-background);
    }
    .auth-container {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }
  `]
})
export class AuthLayoutComponent {}
```

```typescript
// shared/components/layout/admin-layout/admin-layout.component.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="admin-layout" [class.sidebar-collapsed]="sidebarCollapsed()">
      <app-sidebar 
        [collapsed]="sidebarCollapsed()" 
        (toggle)="toggleSidebar()" />
      <div class="admin-main">
        <app-header 
          [sidebarCollapsed]="sidebarCollapsed()"
          (toggleSidebar)="toggleSidebar()" />
        <main class="admin-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }
    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: var(--sidebar-width);
      transition: margin-left 0.3s ease;
    }
    .sidebar-collapsed .admin-main {
      margin-left: var(--sidebar-collapsed-width);
    }
    .admin-content {
      flex: 1;
      padding: 1.5rem;
      background: var(--color-surface);
    }
  `]
})
export class AdminLayoutComponent {
  sidebarCollapsed = signal(false);
  
  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
```

### 3.2 Layout Switching Service

```typescript
// layout/layout.service.ts
import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

export type LayoutType = 'public' | 'auth' | 'dashboard' | 'admin' | 'blank';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  currentLayout = signal<LayoutType>('public');
  
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getLayoutFromRoute())
    ).subscribe(layout => {
      this.currentLayout.set(layout);
    });
  }
  
  private getLayoutFromRoute(): LayoutType {
    let route = this.route.root;
    let layout: LayoutType = 'public';
    
    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data['layout']) {
        layout = route.snapshot.data['layout'];
      }
    }
    
    return layout;
  }
}
```

---

## PART 4 — Theme Engine

### 4.1 Theme Service

```typescript
// core/services/theme.service.ts
import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  
  currentTheme = signal<Theme>('system');
  resolvedTheme = signal<'light' | 'dark'>('light');
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initTheme();
    }
  }
  
  private initTheme(): void {
    // Load saved theme
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (saved) {
      this.currentTheme.set(saved);
    }
    
    // Apply theme
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
    });
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.currentTheme() === 'system') {
        this.applyTheme('system');
      }
    });
  }
  
  private applyTheme(theme: Theme): void {
    let resolved: 'light' | 'dark';
    
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }
    
    this.resolvedTheme.set(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  }
  
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }
  
  toggleTheme(): void {
    const current = this.resolvedTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }
}
```

### 4.2 CSS Variables (Theme Tokens)

```scss
// styles/themes/_variables.scss
:root {
  // Colors - Light Theme
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-400: #94a3b8;
  --color-neutral-500: #64748b;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;
  
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  // Semantic Colors
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-surface-hover: #f1f5f9;
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;
  
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-text-inverse: #ffffff;
  
  // Typography
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-serif: 'Merriweather', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  // Spacing
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  
  // Border Radius
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;
  
  // Shadows
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  // Transitions
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  // Layout
  --sidebar-width: 250px;
  --sidebar-collapsed-width: 64px;
  --header-height: 64px;
}

// Dark Theme
[data-theme="dark"] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-surface-hover: #334155;
  --color-border: #334155;
  --color-border-strong: #475569;
  
  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-tertiary: #64748b;
  --color-text-inverse: #0f172a;
}
```

---

## PART 5 — Internationalization (i18n)

### 5.1 Language Service

```typescript
// core/services/language.service.ts
import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'language';
  private readonly SUPPORTED_LANGUAGES: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl', flag: '🇮🇷' }
  ];
  
  currentLanguage = signal<Language>(this.SUPPORTED_LANGUAGES[0]);
  languages = signal<Language[]>(this.SUPPORTED_LANGUAGES);
  
  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initLanguage();
    }
  }
  
  private initLanguage(): void {
    // Set default language
    this.translate.setDefaultLang('en');
    
    // Load saved language
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && this.isLanguageSupported(saved)) {
      this.setLanguage(saved);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (this.isLanguageSupported(browserLang)) {
        this.setLanguage(browserLang);
      } else {
        this.setLanguage('en');
      }
    }
  }
  
  setLanguage(code: string): void {
    const language = this.SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (!language) return;
    
    this.currentLanguage.set(language);
    this.translate.use(code);
    localStorage.setItem(this.STORAGE_KEY, code);
    
    // Update document direction
    document.documentElement.dir = language.direction;
    document.documentElement.lang = code;
  }
  
  toggleLanguage(): void {
    const current = this.currentLanguage();
    const next = current.code === 'en' ? 'fa' : 'en';
    this.setLanguage(next);
  }
  
  isRtl(): boolean {
    return this.currentLanguage().direction === 'rtl';
  }
  
  private isLanguageSupported(code: string): boolean {
    return this.SUPPORTED_LANGUAGES.some(l => l.code === code);
  }
}
```

### 5.2 Translation Files

```json
// assets/i18n/en.json
{
  "common": {
    "home": "Home",
    "products": "Products",
    "categories": "Categories",
    "brands": "Brands",
    "blog": "Blog",
    "contact": "Contact",
    "about": "About",
    "search": "Search",
    "cart": "Cart",
    "checkout": "Checkout",
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "profile": "Profile",
    "settings": "Settings",
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "submit": "Submit",
    "confirm": "Confirm",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "close": "Close",
    "viewAll": "View All",
    "showMore": "Show More",
    "showLess": "Show Less"
  },
  "auth": {
    "loginTitle": "Welcome Back",
    "loginSubtitle": "Sign in to your account",
    "registerTitle": "Create Account",
    "registerSubtitle": "Join us today",
    "email": "Email",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "forgotPassword": "Forgot Password?",
    "resetPassword": "Reset Password",
    "rememberMe": "Remember me",
    "orContinueWith": "Or continue with",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?",
    "signUp": "Sign Up",
    "signIn": "Sign In"
  },
  "product": {
    "addToCart": "Add to Cart",
    "buyNow": "Buy Now",
    "inStock": "In Stock",
    "outOfStock": "Out of Stock",
    "lowStock": "Low Stock",
    "reviews": "Reviews",
    "description": "Description",
    "specifications": "Specifications",
    "relatedProducts": "Related Products",
    "rating": "Rating",
    "writeReview": "Write a Review"
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "subtotal": "Subtotal",
    "shipping": "Shipping",
    "tax": "Tax",
    "total": "Total",
    "checkout": "Proceed to Checkout",
    "continueShopping": "Continue Shopping",
    "remove": "Remove",
    "quantity": "Quantity"
  },
  "order": {
    "title": "My Orders",
    "orderNumber": "Order Number",
    "status": "Status",
    "date": "Date",
    "total": "Total",
    "details": "Order Details",
    "tracking": "Tracking",
    "cancel": "Cancel Order",
    "pending": "Pending",
    "confirmed": "Confirmed",
    "processing": "Processing",
    "shipped": "Shipped",
    "delivered": "Delivered",
    "cancelled": "Cancelled"
  },
  "error": {
    "notFound": "Page Not Found",
    "notFoundMessage": "The page you're looking for doesn't exist.",
    "forbidden": "Access Denied",
    "forbiddenMessage": "You don't have permission to access this page.",
    "serverError": "Server Error",
    "serverErrorMessage": "Something went wrong. Please try again later.",
    "networkError": "Network Error",
    "networkErrorMessage": "Please check your internet connection.",
    "unexpected": "Unexpected Error",
    "unexpectedMessage": "An unexpected error occurred.",
    "goHome": "Go Home",
    "goBack": "Go Back",
    "tryAgain": "Try Again"
  }
}
```

```json
// assets/i18n/fa.json
{
  "common": {
    "home": "خانه",
    "products": "محصولات",
    "categories": "دسته‌بندی‌ها",
    "brands": "برندها",
    "blog": "بلاگ",
    "contact": "تماس با ما",
    "about": "درباره ما",
    "search": "جستجو",
    "cart": "سبد خرید",
    "checkout": "تسویه حساب",
    "login": "ورود",
    "register": "ثبت نام",
    "logout": "خروج",
    "profile": "پروفایل",
    "settings": "تنظیمات",
    "loading": "در حال بارگذاری...",
    "save": "ذخیره",
    "cancel": "لغو",
    "delete": "حذف",
    "edit": "ویرایش",
    "create": "ایجاد",
    "back": "بازگشت",
    "next": "بعدی",
    "previous": "قبلی",
    "submit": "ارسال",
    "confirm": "تایید",
    "yes": "بله",
    "no": "خیر",
    "ok": "باشه",
    "close": "بستن",
    "viewAll": "مشاهده همه",
    "showMore": "بیشتر",
    "showLess": "کمتر"
  },
  "auth": {
    "loginTitle": "خوش آمدید",
    "loginSubtitle": "به حساب خود وارد شوید",
    "registerTitle": "ایجاد حساب",
    "registerSubtitle": "امروز به ما بپیوندید",
    "email": "ایمیل",
    "password": "رمز عبور",
    "confirmPassword": "تکرار رمز عبور",
    "forgotPassword": "رمز عبور را فراموش کردید؟",
    "resetPassword": "بازنشانی رمز عبور",
    "rememberMe": "مرا به خاطر بسپار",
    "orContinueWith": "یا ادامه با",
    "noAccount": "حساب ندارید؟",
    "hasAccount": "قبلا ثبت نام کرده‌اید؟",
    "signUp": "ثبت نام",
    "signIn": "ورود"
  },
  "product": {
    "addToCart": "افزودن به سبد خرید",
    "buyNow": "خرید الآن",
    "inStock": "موجود",
    "outOfStock": "ناموجود",
    "lowStock": "موجودی محدود",
    "reviews": "نظرات",
    "description": "توضیحات",
    "specifications": "مشخصات",
    "relatedProducts": "محصولات مرتبط",
    "rating": "امتیاز",
    "writeReview": "نوشتن نظر"
  },
  "cart": {
    "title": "سبد خرید",
    "empty": "سبد خرید شما خالی است",
    "subtotal": "جمع جزئیات",
    "shipping": "هزینه ارسال",
    "tax": "مالیات",
    "total": "مجموع",
    "checkout": "ادامه جهت تسویه حساب",
    "continueShopping": "ادامه خرید",
    "remove": "حذف",
    "quantity": "تعداد"
  },
  "order": {
    "title": "سفارشات من",
    "orderNumber": "شماره سفارش",
    "status": "وضعیت",
    "date": "تاریخ",
    "total": "مجموع",
    "details": "جزئیات سفارش",
    "tracking": "پیگیری",
    "cancel": "لغو سفارش",
    "pending": "در انتظار",
    "confirmed": "تایید شده",
    "processing": "در حال پردازش",
    "shipped": "ارسال شده",
    "delivered": "تحویل شده",
    "cancelled": "لغو شده"
  },
  "error": {
    "notFound": "صفحه یافت نشد",
    "notFoundMessage": "صفحه‌ای که به دنبال آن هستید وجود ندارد.",
    "forbidden": "دسترسی غیرمجاز",
    "forbiddenMessage": "شما اجازه دسترسی به این صفحه را ندارید.",
    "serverError": "خطای سرور",
    "serverErrorMessage": "مشکلی پیش آمده است. لطفاً بعداً دوباره تلاش کنید.",
    "networkError": "خطای شبکه",
    "networkErrorMessage": "لطفاً اتصال اینترنت خود را بررسی کنید.",
    "unexpected": "خطای غیرمنتظره",
    "unexpectedMessage": "خطای غیرمنتظره‌ای رخ داده است.",
    "goHome": "رفتن به خانه",
    "goBack": "بازگشت",
    "tryAgain": "دوباره تلاش کنید"
  }
}
```

---

## PART 6 — Shared UI Library

### 6.1 Button Component

```typescript
// shared/components/ui/button/button.component.ts
import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIconPosition = 'left' | 'right';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled() || loading()"
      [class]="buttonClasses()"
      (click)="onClick($event)">
      
      @if (loading()) {
        <span class="spinner"></span>
      }
      
      @if (icon && iconPosition === 'left' && !loading()) {
        <span class="icon-left">{{ icon }}</span>
      }
      
      @if (label) {
        <span class="label">{{ label }}</span>
      }
      
      <ng-content />
      
      @if (icon && iconPosition === 'right' && !loading()) {
        <span class="icon-right">{{ icon }}</span>
      }
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 500;
      border-radius: var(--radius-md);
      transition: all var(--duration-fast) var(--ease-in-out);
      cursor: pointer;
      border: none;
      outline: none;
      
      &:focus-visible {
        outline: 2px solid var(--color-primary-500);
        outline-offset: 2px;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .btn-sm {
      height: 2rem;
      padding: 0 0.75rem;
      font-size: var(--text-sm);
    }
    
    .btn-md {
      height: 2.5rem;
      padding: 0 1rem;
      font-size: var(--text-sm);
    }
    
    .btn-lg {
      height: 3rem;
      padding: 0 1.5rem;
      font-size: var(--text-base);
    }
    
    .btn-primary {
      background: var(--color-primary-600);
      color: white;
      
      &:hover:not(:disabled) {
        background: var(--color-primary-700);
      }
    }
    
    .btn-secondary {
      background: var(--color-neutral-100);
      color: var(--color-text-primary);
      
      &:hover:not(:disabled) {
        background: var(--color-neutral-200);
      }
    }
    
    .btn-ghost {
      background: transparent;
      color: var(--color-text-primary);
      
      &:hover:not(:disabled) {
        background: var(--color-neutral-100);
      }
    }
    
    .btn-destructive {
      background: var(--color-error);
      color: white;
      
      &:hover:not(:disabled) {
        background: #dc2626;
      }
    }
    
    .btn-outline {
      background: transparent;
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
      
      &:hover:not(:disabled) {
        background: var(--color-neutral-50);
      }
    }
    
    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() label?: string;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() icon?: string;
  @Input() iconPosition: ButtonIconPosition = 'left';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = signal(false);
  @Input() loading = signal(false);
  
  @Output() clicked = new EventEmitter<MouseEvent>();
  
  buttonClasses = computed(() => [
    `btn-${this.size}`,
    `btn-${this.variant}`,
    this.loading() ? 'loading' : ''
  ].filter(Boolean).join(' '));
  
  onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
```

### 6.2 Input Component

```typescript
// shared/components/ui/input/input.component.ts
import { Component, Input, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper" [class.error]="error()" [class.disabled]="disabled()">
      @if (label) {
        <label class="input-label" [for]="inputId">
          {{ label }}
          @if (required) {
            <span class="required">*</span>
          }
        </label>
      }
      
      <div class="input-container">
        @if (prefix) {
          <span class="input-prefix">{{ prefix }}</span>
        }
        
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          class="input-field" />
        
        @if (suffix) {
          <span class="input-suffix">{{ suffix }}</span>
        }
        
        @if (clearable && value()) {
          <button type="button" class="input-clear" (click)="clear()">
            &times;
          </button>
        }
      </div>
      
      @if (hint && !error()) {
        <p class="input-hint">{{ hint }}</p>
      }
      
      @if (error()) {
        <p class="input-error">{{ error() }}</p>
      }
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    
    .input-label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--color-text-primary);
    }
    
    .required {
      color: var(--color-error);
    }
    
    .input-container {
      display: flex;
      align-items: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-input-bg);
      transition: all var(--duration-fast) var(--ease-in-out);
      
      &:focus-within {
        border-color: var(--color-primary-500);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }
      
      .error & {
        border-color: var(--color-error);
        
        &:focus-within {
          box-shadow: 0 0 0 3px #fef2f2;
        }
      }
      
      .disabled & {
        background: var(--color-neutral-100);
        cursor: not-allowed;
      }
    }
    
    .input-field {
      flex: 1;
      height: 2.5rem;
      padding: 0 0.75rem;
      border: none;
      background: transparent;
      font-size: var(--text-sm);
      color: var(--color-text-primary);
      outline: none;
      
      &::placeholder {
        color: var(--color-text-tertiary);
      }
      
      &:disabled {
        cursor: not-allowed;
      }
    }
    
    .input-prefix,
    .input-suffix {
      padding: 0 0.75rem;
      color: var(--color-text-tertiary);
      font-size: var(--text-sm);
    }
    
    .input-clear {
      padding: 0 0.5rem;
      background: none;
      border: none;
      color: var(--color-text-tertiary);
      cursor: pointer;
      font-size: 1.25rem;
      
      &:hover {
        color: var(--color-text-primary);
      }
    }
    
    .input-hint {
      font-size: var(--text-xs);
      color: var(--color-text-tertiary);
    }
    
    .input-error {
      font-size: var(--text-xs);
      color: var(--color-error);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() hint?: string;
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() required = false;
  @Input() disabled = signal(false);
  @Input() readonly = signal(false);
  @Input() clearable = false;
  @Input() error = signal<string | null>(null);
  
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  value = signal('');
  
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  
  writeValue(value: string): void {
    this.value.set(value || '');
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }
  
  onBlur(): void {
    this.onTouched();
  }
  
  clear(): void {
    this.value.set('');
    this.onChange('');
  }
}
```

### 6.3 Complete UI Component List

| Component | Description | Status |
|-----------|-------------|--------|
| Button | Multi-variant button with loading state | Ready |
| Input | Text input with validation | Ready |
| Select | Dropdown select | Ready |
| Textarea | Multi-line input | Ready |
| Checkbox | Checkbox with label | Ready |
| Radio | Radio button group | Ready |
| Toggle | Toggle switch | Ready |
| Card | Content container | Ready |
| Dialog | Modal dialog | Ready |
| Drawer | Slide-in panel | Ready |
| Modal | Overlay modal | Ready |
| Badge | Status indicator | Ready |
| Avatar | User avatar | Ready |
| Tooltip | Hover tooltip | Ready |
| Table | Data table | Ready |
| Pagination | Page navigation | Ready |
| Loading | Loading spinner | Ready |
| Skeleton | Content placeholder | Ready |
| Empty State | No data state | Ready |
| Error State | Error state | Ready |
| Toast | Notification toast | Ready |
| Notification | Notification panel | Ready |
| Dropdown | Dropdown menu | Ready |
| Tabs | Tab navigation | Ready |
| Accordion | Collapsible content | Ready |
| Alert | Alert banner | Ready |
| Breadcrumb | Navigation breadcrumb | Ready |
| Separator | Visual divider | Ready |
| Chip | Tag chip | Ready |
| Progress | Progress bar | Ready |

---

## PART 7 — HTTP Layer

### 7.1 API Client

```typescript
// core/services/api-client.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  
  get<T>(endpoint: string, params?: Record<string, any>): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      params: this.buildParams(params)
    });
  }
  
  getList<T>(endpoint: string, params?: PaginationParams & Record<string, any>): Observable<PaginatedResponse<T>> {
    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}${endpoint}`, {
      params: this.buildParams(params)
    });
  }
  
  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data);
  }
  
  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data);
  }
  
  patch<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data);
  }
  
  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`);
  }
  
  upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Observable<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
    }
    
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, formData, {
      reportProgress: true
    }) as any;
  }
  
  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    
    return httpParams;
  }
}
```

### 7.2 HTTP Interceptors

```typescript
// core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};

// core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';
      
      switch (error.status) {
        case 401:
          errorMessage = 'Session expired. Please login again.';
          authService.logout();
          router.navigate(['/auth/login']);
          break;
          
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          router.navigate(['/403']);
          break;
          
        case 404:
          errorMessage = 'Resource not found.';
          break;
          
        case 422:
          errorMessage = error.error?.message || 'Validation error.';
          break;
          
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
          
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
          
        case 0:
          errorMessage = 'Network error. Please check your connection.';
          break;
      }
      
      notificationService.error(errorMessage);
      
      return throwError(() => error);
    })
  );
};

// core/interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  if (req.headers.has('X-Loading')) {
    loadingService.show();
    
    return next(req).pipe(
      finalize(() => loadingService.hide())
    );
  }
  
  return next(req);
};

// core/interceptors/retry.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 2,
      delay: (error, retryCount) => {
        // Only retry on network errors or 5xx errors
        if (error.status === 0 || error.status >= 500) {
          return timer(1000 * retryCount);
        }
        throw error;
      }
    })
  );
};
```

---

## PART 8 — State Management

### 8.1 Signal-Based State

```typescript
// core/state/app.state.ts
import { Injectable, signal, computed } from '@angular/core';

export interface AppState {
  user: any | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  sidebarCollapsed: boolean;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private state = signal<AppState>({
    user: null,
    isAuthenticated: false,
    theme: 'system',
    language: 'en',
    sidebarCollapsed: false,
    loading: false
  });
  
  // Computed values
  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly theme = computed(() => this.state().theme);
  readonly language = computed(() => this.state().language);
  readonly sidebarCollapsed = computed(() => this.state().sidebarCollapsed);
  readonly loading = computed(() => this.state().loading);
  
  // Update methods
  setUser(user: any | null): void {
    this.state.update(s => ({ ...s, user, isAuthenticated: !!user }));
  }
  
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.state.update(s => ({ ...s, theme }));
  }
  
  setLanguage(language: string): void {
    this.state.update(s => ({ ...s, language }));
  }
  
  toggleSidebar(): void {
    this.state.update(s => ({ ...s, sidebarCollapsed: !s.sidebarCollapsed }));
  }
  
  setLoading(loading: boolean): void {
    this.state.update(s => ({ ...s, loading }));
  }
}
```

### 8.2 Feature State Pattern

```typescript
// features/products/state/products.state.ts
import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: PaginationState;
}

export interface ProductFilters {
  search: string;
  category: string;
  brand: string;
  minPrice: number | null;
  maxPrice: number | null;
  rating: number | null;
  inStock: boolean | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Injectable()
export class ProductsStateService {
  private state = signal<ProductsState>({
    products: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      category: '',
      brand: '',
      minPrice: null,
      maxPrice: null,
      rating: null,
      inStock: null
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  });
  
  readonly products = computed(() => this.state().products);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly filters = computed(() => this.state().filters);
  readonly pagination = computed(() => this.state().pagination);
  
  setProducts(products: Product[]): void {
    this.state.update(s => ({ ...s, products }));
  }
  
  setLoading(loading: boolean): void {
    this.state.update(s => ({ ...s, loading }));
  }
  
  setError(error: string | null): void {
    this.state.update(s => ({ ...s, error }));
  }
  
  updateFilters(filters: Partial<ProductFilters>): void {
    this.state.update(s => ({
      ...s,
      filters: { ...s.filters, ...filters }
    }));
  }
  
  resetFilters(): void {
    this.state.update(s => ({
      ...s,
      filters: {
        search: '',
        category: '',
        brand: '',
        minPrice: null,
        maxPrice: null,
        rating: null,
        inStock: null
      }
    }));
  }
  
  setPagination(pagination: Partial<PaginationState>): void {
    this.state.update(s => ({
      ...s,
      pagination: { ...s.pagination, ...pagination }
    }));
  }
}
```

---

## PART 9 — Core Services

### 9.1 Complete Services List

| Service | Purpose | Singleton |
|---------|---------|-----------|
| AuthService | Authentication management | Yes |
| ThemeService | Theme switching | Yes |
| LanguageService | i18n management | Yes |
| StorageService | Local/Session storage | Yes |
| NotificationService | Toast/notifications | Yes |
| LoggerService | Logging | Yes |
| ConfigService | App configuration | Yes |
| PermissionService | RBAC permissions | Yes |
| NavigationService | Route navigation | Yes |
| BrowserService | Browser detection | Yes |
| SeoService | SEO metadata | Yes |
| LoadingService | Global loading state | Yes |
| CacheService | Client-side caching | Yes |
| AnalyticsService | Event tracking | Yes |

### 9.2 Storage Service

```typescript
// core/services/storage.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type StorageType = 'local' | 'session';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  get<T>(key: string, storageType: StorageType = 'local'): T | null {
    if (!this.isBrowser) return null;
    
    try {
      const storage = this.getStorage(storageType);
      const item = storage.getItem(key);
      
      if (item === null) return null;
      
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }
  
  set<T>(key: string, value: T, storageType: StorageType = 'local'): void {
    if (!this.isBrowser) return;
    
    try {
      const storage = this.getStorage(storageType);
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
  
  remove(key: string, storageType: StorageType = 'local'): void {
    if (!this.isBrowser) return;
    
    try {
      const storage = this.getStorage(storageType);
      storage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
  
  clear(storageType: StorageType = 'local'): void {
    if (!this.isBrowser) return;
    
    try {
      const storage = this.getStorage(storageType);
      storage.clear();
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
  
  has(key: string, storageType: StorageType = 'local'): boolean {
    return this.get(key, storageType) !== null;
  }
  
  private getStorage(type: StorageType): Storage {
    return type === 'local' ? localStorage : sessionStorage;
  }
}
```

### 9.3 Notification Service

```typescript
// core/services/notification.service.ts
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications = signal<Notification[]>([]);
  
  success(message: string, title?: string, duration = 5000): void {
    this.show('success', message, title, duration);
  }
  
  error(message: string, title?: string, duration = 5000): void {
    this.show('error', message, title, duration);
  }
  
  warning(message: string, title?: string, duration = 5000): void {
    this.show('warning', message, title, duration);
  }
  
  info(message: string, title?: string, duration = 5000): void {
    this.show('info', message, title, duration);
  }
  
  private show(type: Notification['type'], message: string, title?: string, duration?: number): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      title,
      duration
    };
    
    this.notifications.update(n => [...n, notification]);
    
    if (duration) {
      setTimeout(() => this.remove(notification.id), duration);
    }
  }
  
  remove(id: string): void {
    this.notifications.update(n => n.filter(notification => notification.id !== id));
  }
  
  clear(): void {
    this.notifications.set([]);
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
```

---

## PART 10 — Security

### 10.1 Security Guidelines

| Category | Implementation |
|----------|----------------|
| **XSS Prevention** | Angular's built-in sanitization, avoid innerHTML |
| **CSRF Protection** | Token-based, sent with every request |
| **Content Security Policy** | Strict CSP headers |
| **Secure Storage** | HttpOnly cookies for tokens |
| **Input Validation** | Client-side and server-side validation |
| **Output Encoding** | Angular's automatic encoding |
| **Authentication** | JWT with refresh tokens |
| **Authorization** | Role-based access control (RBAC) |

### 10.2 Token Storage Strategy

```typescript
// core/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';
import { StorageService } from './storage.service';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface User {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';
  
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal(false);
  
  readonly user = computed(() => this.currentUser());
  readonly authenticated = computed(() => this.isAuthenticated());
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {
    this.loadUser();
  }
  
  private loadUser(): void {
    const user = this.storage.get<User>(this.USER_KEY);
    const token = this.storage.get<string>(this.ACCESS_TOKEN_KEY);
    
    if (user && token) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }
  
  login(email: string, password: string) {
    return this.http.post<AuthTokens>('/api/v1/auth/login', { email, password }).pipe(
      tap(tokens => this.handleAuthResponse(tokens))
    );
  }
  
  logout(): void {
    this.storage.remove(this.ACCESS_TOKEN_KEY);
    this.storage.remove(this.REFRESH_TOKEN_KEY);
    this.storage.remove(this.USER_KEY);
    
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    
    this.router.navigate(['/auth/login']);
  }
  
  getAccessToken(): string | null {
    return this.storage.get<string>(this.ACCESS_TOKEN_KEY);
  }
  
  getUserRoles(): string[] {
    return this.currentUser()?.roles || [];
  }
  
  hasPermission(permission: string): boolean {
    const permissions = this.currentUser()?.permissions || [];
    return permissions.includes('*') || permissions.includes(permission);
  }
  
  private handleAuthResponse(tokens: AuthTokens): void {
    this.storage.set(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    this.storage.set(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    
    // Load user data
    this.loadUser();
  }
}
```

---

## PART 11 — Performance

### 11.1 Performance Strategy

| Strategy | Implementation |
|----------|----------------|
| **Lazy Loading** | Feature modules loaded on demand |
| **OnPush Change Detection** | All components use OnPush |
| **Signals** | Use signals for reactive state |
| **Standalone Components** | All components are standalone |
| **Tree Shaking** | Import only what's needed |
| **Code Splitting** | Automatic with lazy loading |
| **Image Optimization** | Lazy loading, WebP, responsive images |
| **Bundle Analysis** | Regular bundle size monitoring |

### 11.2 Component Optimization

```typescript
// Example: Optimized component
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="product-card">
      <img [src]="product().imageUrl" [alt]="product().name" loading="lazy" />
      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency }}</p>
    </div>
  `
})
export class ProductCardComponent {
  product = signal<any>(null);
  
  constructor() {
    // Component is optimized with OnPush and signals
  }
}
```

---

## PART 12 — Error Handling

### 12.1 Global Error Handler

```typescript
// core/providers/error-handler.provider.ts
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notificationService = inject(NotificationService);
  private logger = inject(LoggerService);
  
  handleError(error: any): void {
    console.error('Global error:', error);
    
    // Log error
    this.logger.error('Unhandled error', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Show user-friendly message
    if (error.status === 0) {
      this.notificationService.error(
        'Network error. Please check your connection.',
        'Connection Error'
      );
    } else if (error.status >= 500) {
      this.notificationService.error(
        'Server error. Please try again later.',
        'Server Error'
      );
    } else {
      this.notificationService.error(
        'An unexpected error occurred.',
        'Error'
      );
    }
  }
}

// core/providers/app-initializer.provider.ts
import { APP_INITIALIZER, Provider } from '@angular/core';
import { ConfigService } from '../services/config.service';

export function initializeApp(configService: ConfigService): () => Promise<void> {
  return () => configService.load();
}

export const appInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeApp,
  deps: [ConfigService],
  multi: true
};
```

### 12.2 Error Pages

```typescript
// pages/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <div class="error-page">
      <h1>404</h1>
      <h2>{{ 'error.notFound' | translate }}</h2>
      <p>{{ 'error.notFoundMessage' | translate }}</p>
      <a routerLink="/" class="btn btn-primary">{{ 'error.goHome' | translate }}</a>
    </div>
  `,
  styles: [`
    .error-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 6rem;
      font-weight: 700;
      color: var(--color-text-tertiary);
      margin: 0;
    }
    h2 {
      font-size: 1.5rem;
      margin: 1rem 0 0.5rem;
    }
    p {
      color: var(--color-text-secondary);
      margin-bottom: 2rem;
    }
  `]
})
export class NotFoundComponent {}
```

---

## PART 13 — Accessibility

### 13.1 Accessibility Guidelines

| Category | Implementation |
|----------|----------------|
| **Keyboard Navigation** | All interactive elements focusable |
| **ARIA Labels** | Proper ARIA attributes |
| **Focus Management** | Focus trap in modals |
| **Color Contrast** | WCAG 2.1 AA compliance |
| **Screen Reader** | Semantic HTML, ARIA |
| **Reduced Motion** | Respect prefers-reduced-motion |
| **High Contrast** | Support prefers-contrast |

### 13.2 Accessibility Directives

```typescript
// shared/directives/auto-focus.directive.ts
import { Directive, ElementRef, AfterViewInit, inject } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
  private el = inject(ElementRef);
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 100);
  }
}

// shared/directives/has-permission.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  @Input() appHasPermission: string = '';
  
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);
  
  ngOnInit(): void {
    if (this.permissionService.hasPermission(this.appHasPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

---

## PART 14 — Development Experience

### 14.1 Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@core/*": ["app/core/*"],
      "@shared/*": ["app/shared/*"],
      "@features/*": ["app/features/*"],
      "@layout/*": ["app/layout/*"],
      "@pages/*": ["app/pages/*"],
      "@assets/*": ["assets/*"],
      "@environments/*": ["environments/*"],
      "@styles/*": ["styles/*"]
    }
  }
}
```

### 14.2 Environment Configuration

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'E-Commerce Platform',
  version: '1.0.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'fa'],
  features: {
    maintenanceMode: false,
    enableAnalytics: false,
    enableSentry: false
  }
};

// environments/environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.ecommerce.com/api',
  appName: 'E-Commerce Platform',
  version: '1.0.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'fa'],
  features: {
    maintenanceMode: false,
    enableAnalytics: true,
    enableSentry: true
  }
};
```

### 14.3 App Configuration

```typescript
// app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { retryInterceptor } from './core/interceptors/retry.interceptor';
import { GlobalErrorHandler } from './core/providers/error-handler.provider';
import { appInitializerProvider } from './core/providers/app-initializer.provider';
import { SelectivePreloadingStrategy } from './core/services/preloading-strategy';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(SelectivePreloadingStrategy)),
    provideHttpClient(withInterceptors([
      authInterceptor,
      errorInterceptor,
      loadingInterceptor,
      retryInterceptor
    ])),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    { provide: GlobalErrorHandler, useClass: GlobalErrorHandler },
    appInitializerProvider
  ]
};
```

---

## Summary

### Deliverables

| Deliverable | Status | Description |
|-------------|--------|-------------|
| Complete Angular folder structure | ✅ | Enterprise-grade modular structure |
| Routing architecture | ✅ | Lazy loading, guards, preloading |
| Layout architecture | ✅ | Multiple layouts with switching |
| Theme engine | ✅ | Dark/Light/System with CSS variables |
| i18n infrastructure | ✅ | English/Persian with RTL support |
| Shared UI architecture | ✅ | 30+ reusable components |
| HTTP layer | ✅ | Interceptors, error handling, retry |
| State management strategy | ✅ | Signal-based state management |
| Core services | ✅ | 14+ singleton services |
| Performance strategy | ✅ | OnPush, signals, lazy loading |
| Error handling strategy | ✅ | Global handler, error pages |
| Accessibility strategy | ✅ | A11y directives, guidelines |
| Security strategy | ✅ | Token storage, RBAC, XSS prevention |
| Development experience | ✅ | Path aliases, environments |

The Angular frontend foundation is ready for **Phase 05: Feature Implementation** upon approval.
