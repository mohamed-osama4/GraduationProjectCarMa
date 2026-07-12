class UserModel {
  final int id;
  final String name;
  final String email;
  final String role;
  final String phoneNumber;
  final String? token;
  final String? createdAt;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.phoneNumber = '',
    this.token,
    this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? '',
      phoneNumber: json['phoneNumber'] as String? ?? '',
      token: json['token'] as String?,
      createdAt: json['createdAt'] as String?,
    );
  }

  /// Returns a copy with updated fields
  UserModel copyWith({String? name, String? phoneNumber}) {
    return UserModel(
      id: id,
      name: name ?? this.name,
      email: email,
      role: role,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      token: token,
      createdAt: createdAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'phoneNumber': phoneNumber,
    };
  }
}
