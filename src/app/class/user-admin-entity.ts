export class UserAdminEntity {
    identityCard : string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    phoneNumber : string;
    rol : number;
    profilePicture : string;
  
    constructor(
      identityCard : string,
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      userName: string,
      phoneNumber : string,
      rol : number,
      profilePicture : string

    ) {
      this.identityCard = identityCard;
      this.email = email;
      this.password = password;
      this.firstName = firstName;
      this.lastName = lastName;
      this.userName = userName;
      this.phoneNumber = phoneNumber;
      this.rol = rol;
      this.profilePicture = profilePicture;

    }
  }