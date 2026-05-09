enum OrderStatus {
  pending,
  accepted,
  inProgress,
  completed,
  rejected,
  // Legacy aliases kept for backward compat
  newOrder,
  onTheWay,
  underProcess,
  canceled,
}

OrderStatus _orderStatusFromString(dynamic status) {
  if (status == null) return OrderStatus.pending;

  // Handle integer (C# enum default JSON serialization: 0=Pending, 1=Accepted...)
  if (status is int) {
    switch (status) {
      case 0: return OrderStatus.pending;
      case 1: return OrderStatus.accepted;
      case 2: return OrderStatus.inProgress;
      case 3: return OrderStatus.completed;
      case 4: return OrderStatus.rejected;
      default: return OrderStatus.pending;
    }
  }

  // Handle string (e.g. "Pending", "Accepted")
  switch (status.toString().toLowerCase()) {
    case 'pending':      return OrderStatus.pending;
    case 'new':          return OrderStatus.pending;
    case 'accepted':     return OrderStatus.accepted;
    case 'ontheway':     return OrderStatus.accepted;
    case 'inprogress':   return OrderStatus.inProgress;
    case 'underprocess': return OrderStatus.inProgress;
    case 'completed':    return OrderStatus.completed;
    case 'rejected':     return OrderStatus.rejected;
    case 'canceled':     return OrderStatus.rejected;
    default:             return OrderStatus.pending;
  }
}

class OrderModel {
  final int id;
  final int userId;
  final int vehicleId;
  final int serviceId;
  final OrderStatus orderStatus;
  final String address;
  final String phoneNumber;
  final double price;
  final bool isPaid;
  final String paymentMethod;

  // Technician info (filled when admin accepts)
  final int? technicianId;
  final String? technicianName;
  final String? technicianPhone;
  final double? technicianRating;
  final int? estimatedArrival; // minutes

  final DateTime createdAt;
  final DateTime? updatedAt;

  OrderModel({
    required this.id,
    required this.userId,
    required this.vehicleId,
    required this.serviceId,
    required this.orderStatus,
    required this.address,
    required this.phoneNumber,
    this.price = 0.0,
    this.isPaid = false,
    this.paymentMethod = 'Cash',
    this.technicianId,
    this.technicianName,
    this.technicianPhone,
    this.technicianRating,
    this.estimatedArrival,
    required this.createdAt,
    this.updatedAt,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id:              json['id'] as int? ?? 0,
      userId:          json['userId'] as int? ?? 0,
      vehicleId:       json['vehicleId'] as int? ?? 0,
      serviceId:       json['serviceId'] as int? ?? 0,
      orderStatus:     _orderStatusFromString(json['orderStatus']),
      address:         json['address'] as String? ?? '',
      phoneNumber:     json['phoneNumber'] as String? ?? '',
      price:           (json['price'] as num?)?.toDouble() ?? 0.0,
      isPaid:          json['isPaid'] as bool? ?? false,
      paymentMethod:   json['paymentMethod'] as String? ?? 'Cash',
      technicianId:    json['technicianId'] as int?,
      technicianName:  json['technicianName'] as String?,
      technicianPhone: json['technicianPhone'] as String?,
      technicianRating: (json['technicianRating'] as num?)?.toDouble(),
      estimatedArrival: json['estimatedArrival'] as int?,
      createdAt:       json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      updatedAt:       json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  bool get hasTechnician => technicianName != null && technicianName!.isNotEmpty;

  // Convenience helpers
  bool get isPending   => orderStatus == OrderStatus.pending;
  bool get isAccepted  => orderStatus == OrderStatus.accepted;
  bool get isInProgress => orderStatus == OrderStatus.inProgress;
  bool get isCompleted => orderStatus == OrderStatus.completed;
  bool get isRejected  => orderStatus == OrderStatus.rejected;
  bool get isActive    => !isCompleted && !isRejected;
}

class CreateOrderDto {
  final int userId;
  final int vehicleId;
  final int serviceId;
  final String address;
  final String phoneNumber;
  final String? carImagePath; // local path (stored on device only)
  final String? serviceName;  // stored locally for display
  final String? notes;        // stored locally for display

  CreateOrderDto({
    required this.userId,
    required this.vehicleId,
    required this.serviceId,
    required this.address,
    required this.phoneNumber,
    this.carImagePath,
    this.serviceName,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'vehicleId': vehicleId,
      'serviceId': serviceId,
      'address': address,
      'phoneNumber': phoneNumber,
      // Note: image and serviceName are stored locally, not sent to backend
    };
  }
}
