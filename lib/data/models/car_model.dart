/// Model representing a car fetched from the backend.
/// Matches: GET /api/cars → Car { id, brand, model, year, plateNumber, color, isPrimary, userId }
class CarModel {
  final int id;
  final String brand;
  final String model;
  final int year;
  final String plateNumber;
  final String color;
  final bool isPrimary;
  final int userId;

  const CarModel({
    required this.id,
    required this.brand,
    required this.model,
    required this.year,
    required this.plateNumber,
    required this.color,
    required this.isPrimary,
    required this.userId,
  });

  factory CarModel.fromJson(Map<String, dynamic> json) {
    return CarModel(
      id: json['id'] as int? ?? 0,
      brand: json['brand'] as String? ?? '',
      model: json['model'] as String? ?? '',
      year: json['year'] as int? ?? 0,
      plateNumber: json['plateNumber'] as String? ?? '',
      color: json['color'] as String? ?? '',
      isPrimary: json['isPrimary'] as bool? ?? false,
      userId: json['userId'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'brand': brand,
      'model': model,
      'year': year,
      'plateNumber': plateNumber,
      'color': color,
      'isPrimary': isPrimary,
    };
  }

  /// Display name combining brand and model
  String get displayName => '$brand $model';

  /// Full display string
  String get fullDisplayName => '$brand $model ($year)';
}
