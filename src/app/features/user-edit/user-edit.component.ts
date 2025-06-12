import { Component, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { IUser } from '../../entity/user.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { FormService } from '../../services/utils/form.service';
import { UsersService } from '../../services/users/users.service';
import { NotificationService } from '../../services/notification/notification.service';
import { MediaService } from '../../services/media/media.service';

@Component({
  selector: 'user-edit',
  imports: [InputTextModule, FloatLabelModule, FormsModule, ReactiveFormsModule, CommonModule, ButtonModule, KhButtonComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {
  private loggedUserService = inject(LoggedUserService);
  private fb = inject(FormBuilder);
  private formService = inject(FormService);
  private userService = inject(UsersService);
  private notificationService = inject(NotificationService);
  private mediaService = inject(MediaService);

  user = signal<IUser>(this.loggedUserService.getUser());
  img_upload = signal<File | null>(null);
  isSavingUser = signal<boolean>(false);

  userForm!:FormGroup

  ngOnInit() {
    this.userForm = this.fb.group({
      name: [this.user()?.name,  this.formService.requiredValidator()],
      email: [this.user()?.email],
      profile_picture: [this.user()?.profile_picture]
    });

    this.userForm.controls['email'].disable();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.img_upload.set(file);
      this.uploadImageToImgur();
    }
  }

  uploadImageToImgur(){
    if (!this.img_upload() || !(this.img_upload() instanceof File)) {
      this.notificationService.toastError('No image selected');
      return;
    }
    else{
      this.mediaService.uploadImage(this.img_upload() as File).subscribe({
        next: (res:any) => {
          if (!res || !res.url ) {
            this.notificationService.toastError('Image upload failed');
            return;
          }
          const imageUrl = res.url;
          this.user.update(user => ({
            ...user,
            profile_picture: imageUrl
          }));
          this.loggedUserService.setUser(this.user());
          this.userForm.patchValue({ profile_picture: imageUrl });
          this.notificationService.toastSuccess('Image uploaded successfully');
        },
        error: (err:any) => {
          console.error('Error uploading image:', err);
          this.notificationService.toastError('Error uploading image');
        }
      });
    }


  }

  handleSave() {
    if(!this.formService.validateForm(this.userForm)) {
      return;
    }
    this.isSavingUser.set(true);

    const userId = this.user().id;
    if (!userId) {
      this.loggedUserService.logout();
      this.isSavingUser.set(false);
      return;
    }
    this.userService.update(userId, this.userForm.getRawValue()).subscribe({
      next: (res) => {
        if (!res) {
          console.error('User not found');
          this.isSavingUser.set(false);
          return;
        }

        const user = res as IUser;

        this.user.set(user);
        this.loggedUserService.setUser(user);
        this.isSavingUser.set(false);
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.isSavingUser.set(false);
      },
      complete: () => {
        this.isSavingUser.set(false);
      }
    })
  }

}
