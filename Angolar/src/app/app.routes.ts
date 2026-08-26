import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Login } from './Components/login/login';
import { Entry } from './Components/entry/entry';
import { LoginToGuide } from './Components/login-to-guide/login-to-guide';
import { LoginToCoordinator } from './Components/login-to-coordinator/login-to-coordinator';
import { HomePage } from './Components/home-page/home-page';
import { ResetPassword } from './Components/reset-password/reset-password';
import { authGuard } from './Guard/auth-guard';
import { Guide } from './Components/Entities/guides/guide/guide';
import { Hotels } from './Components/Entities/Accommodations/hotels/hotels';
import { Attractions } from './Components/Entities/attractiones/attractions/attractions';
import { Trails } from './Components/Entities/trailes/trails/trails';
import { EditUser } from './Components/edit-user/edit-user';
import { EditTrail } from './Components/Entities/trailes/edit-trail/edit-trail';
import { ExperienceUpdate } from './Components/forums/experience-update/experience-update';
import { Forum } from './Components/forums/forum/forum';
import { Availability } from './Components/Entities/guides/availability/availability';
import { RatingsList } from './Components/ratings-list/ratings-list';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'entry', component: Entry },
    { path: 'login-to-guide', component: LoginToGuide },
    { path: 'login-to-coordinator', component: LoginToCoordinator },
    { path: 'home-page', component: HomePage, canActivate: [authGuard] },
    { path: 'reset-password', component: ResetPassword },
    { path: 'guide', component: Guide },
    { path: 'hotels', component: Hotels },
    { path: 'attractions', component: Attractions },
    { path: 'trails', component: Trails },
    { path: 'editUser', component: EditUser },
    { path: 'editTrail', component: EditTrail },
    { path: 'forum/:forumId', component: ExperienceUpdate },
    { path: 'addbForum/:forumId', component: Forum },
    {path: 'availability', component :Availability},
    { path: 'ratings/:type/:id', component: RatingsList },


];
