/// Model representing a service fetched from the backend.
class ServiceModel {
  final int id;
  final String name;
  final String description;
  final double price;

  const ServiceModel({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id:          json['id'] as int? ?? 0,
      name:        json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      price:       (json['price'] as num?)?.toDouble() ?? 0.0,
    );
  }

  /// Formatted price string, e.g. "150 جنيه" / "150 EGP"
  String formattedPrice(bool isArabic) =>
      '${price.toStringAsFixed(0)} ${isArabic ? 'جنيه' : 'EGP'}';
}
