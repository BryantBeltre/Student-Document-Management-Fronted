export class UserEntity {
  identityCard: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  rol: number;
  profilePicture?: string;
  studentId: string;  // Nuevo campo

  constructor(
    identityCard: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    rol: number,
    studentId: string,  // Aceptar el nuevo campo en el constructor
    profilePicture?: string
  ) {
    this.identityCard = identityCard;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.rol = rol;
    this.studentId = studentId;  // Asignar el valor al campo
    this.profilePicture = profilePicture;
  }
}