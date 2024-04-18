import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {MatTabGroup} from '@angular/material/tabs';
import { UserModel, UserSchema } from "./models/user.model";
import { EnchereModel, EnchereSchema } from "./models/enchere.model";
import { ProfileModel, ProfileSchema } from "./models/profile.model";
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {provide: "UserModel", useClass: UserSchema},
    {provide: "ProfileModel", useClass: ProfileSchema},
    {provide: "EnchereModel", useClass: EnchereSchema}
  ]
})
export class AppComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  public title: string = 'NftCrypto';
  public currentTabIndex: number = 0;
  menuOpen: boolean = false;
  isLogged: boolean = false;
  isLoading: boolean = true;

/*  @ViewChild('targetLoginMenu') targetLoginMenu: MatTabGroup;
*/
  constructor(private formBuilder: FormBuilder, private authService: AuthService){

    this.loginForm = this.formBuilder.group({
      address:['', [Validators.required]],
      password:['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.formBuilder.group({
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void{
    this.authService.isLoggedIn().then((res) => {
      this.isLogged = res;
      this.isLoading = false;
    });
  }

  onLogin(): void{
    console.log(this.loginForm.value);
/*    this.authService.create("email","name","password").then(user => {
      console.log(user);
    }).catch(e => {
      console.error(e);
    })*/
  }

  onRegister(): void{
    console.log(this.registerForm.value)
  }

  getSelectedIndex(): number {
    return this.currentTabIndex
  }

  onTabChange(event: MatTabChangeEvent) {
    this.currentTabIndex = event.index;
  }

  OnMenuOpened() {
    this.menuOpen = true;
/*    this.targetLoginMenu.realignInkBar();
*/  }
}
