import 'package:flutter/material.dart';
import 'package:insurance_mob/constants/enums.dart';

class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({super.key, required this.status});

  Color _color() {
    final s = status.toLowerCase().replaceAll(' ', '_');
    switch (s) {
      case 'submitted':
        return Colors.blue;
      case 'under_review':
        return Colors.amber.shade800;
      case 'verified':
        return Colors.indigo;
      case 'approved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      case 'settled':
        return Colors.teal;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = _color();
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: c.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        claimStatusLabel(status),
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: c,
        ),
      ),
    );
  }
}
