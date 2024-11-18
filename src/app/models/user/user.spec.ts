import { User } from './user';

describe('User', () => {
  it('should create an instance with default values', () => {
    const user = new User({});
    expect(user).toBeTruthy();
    expect(user._id).toBe('');
    expect(user.firstname).toBe('');
    expect(user.name).toBe('');
    expect(user.email).toBe('');
    expect(user.address).toBeUndefined();
    expect(user.role).toBe('buyer');
    expect(user.password).toBeUndefined();
  });

  it('should create an instance with provided values', () => {
    const userData = {
      id: '123',
      firstname: 'John',
      name: 'Doe',
      email: 'john.doe@example.com',
      address: '123 Main St',
      role: 'seller' as 'seller', // Ajout explicite pour correspondre au type attendu
      password: 'securepassword',
    };
    const user = new User(userData);

    expect(user).toBeTruthy();
    expect(user._id).toBe('123');
    expect(user.firstname).toBe('John');
    expect(user.name).toBe('Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.address).toBe('123 Main St');
    expect(user.role).toBe('seller');
    expect(user.password).toBe('securepassword');
  });

  it('should create an instance from JSON', () => {
    const jsonData = {
      _id: '456',
      firstname: 'Jane',
      name: 'Smith',
      email: 'jane.smith@example.com',
      address: '456 Elm St',
      role: 'manager', // Valeur valide pour le type
    };
    const user = User.createFrom(jsonData);

    expect(user).toBeTruthy();
    expect(user._id).toBe('456');
    expect(user.firstname).toBe('Jane');
    expect(user.name).toBe('Smith');
    expect(user.email).toBe('jane.smith@example.com');
    expect(user.address).toBe('456 Elm St');
    expect(user.role).toBe('manager');
    expect(user.password).toBeUndefined(); // Car le JSON ne contient pas de mot de passe
  });
});
