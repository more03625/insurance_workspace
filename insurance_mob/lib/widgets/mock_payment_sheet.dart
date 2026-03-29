import 'package:flutter/material.dart';

class MockPaymentSheet extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onSuccess;
  final VoidCallback onFailure;

  const MockPaymentSheet({
    super.key,
    required this.title,
    required this.subtitle,
    required this.onSuccess,
    required this.onFailure,
  });

  static Future<void> show(
    BuildContext context, {
    required String title,
    required String subtitle,
    required VoidCallback onSuccess,
    required VoidCallback onFailure,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom,
        ),
        child: MockPaymentSheet(
          title: title,
          subtitle: subtitle,
          onSuccess: () {
            Navigator.pop(ctx);
            onSuccess();
          },
          onFailure: () {
            Navigator.pop(ctx);
            onFailure();
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(title,
              style:
                  const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(subtitle, style: TextStyle(color: Colors.grey.shade600)),
          const SizedBox(height: 24),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.green),
            onPressed: onSuccess,
            child: const Text('Pay — Success'),
          ),
          const SizedBox(height: 8),
          OutlinedButton(
            style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
            onPressed: onFailure,
            child: const Text('Pay — Failure'),
          ),
        ],
      ),
    );
  }
}
