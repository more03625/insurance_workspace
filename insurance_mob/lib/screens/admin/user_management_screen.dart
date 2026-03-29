import 'package:flutter/material.dart';
import 'package:insurance_mob/constants/enums.dart';
import 'package:insurance_mob/models/user.dart';
import 'package:insurance_mob/services/user_service.dart';
import 'package:insurance_mob/widgets/loading_indicator.dart';

class UserManagementScreen extends StatefulWidget {
  const UserManagementScreen({super.key});

  @override
  State<UserManagementScreen> createState() => _UserManagementScreenState();
}

class _UserManagementScreenState extends State<UserManagementScreen> {
  List<User> _users = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _users = await UserService().listUsers();
    } catch (_) {
      _users = [];
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _load,
      child: _loading
          ? const LoadingIndicator()
          : ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              children: [
                FilledButton(
                  onPressed: () => _showCreate(context),
                  child: const Text('Create user'),
                ),
                const SizedBox(height: 16),
                ..._users.map((u) => ListTile(
                      title: Text(u.username),
                      subtitle: Text('${u.email} · ${u.role}'),
                    )),
              ],
            ),
    );
  }

  Future<void> _showCreate(BuildContext context) async {
    final first = TextEditingController();
    final last = TextEditingController();
    final email = TextEditingController();
    final user = TextEditingController();
    final pass = TextEditingController();
    String role = UserRoles.policyholder;

    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setS) => AlertDialog(
          title: const Text('Create user'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                    controller: first,
                    decoration: const InputDecoration(labelText: 'First name')),
                TextField(
                    controller: last,
                    decoration: const InputDecoration(labelText: 'Last name')),
                TextField(
                    controller: email,
                    decoration: const InputDecoration(labelText: 'Email')),
                TextField(
                    controller: user,
                    decoration: const InputDecoration(labelText: 'Username')),
                TextField(
                    controller: pass,
                    obscureText: true,
                    decoration: const InputDecoration(labelText: 'Password')),
                DropdownButtonFormField<String>(
                  value: role,
                  items: const [
                    DropdownMenuItem(
                        value: UserRoles.policyholder,
                        child: Text('Policyholder')),
                    DropdownMenuItem(
                        value: UserRoles.employee, child: Text('Employee')),
                    DropdownMenuItem(
                        value: UserRoles.admin, child: Text('Admin')),
                  ],
                  onChanged: (v) => setS(() => role = v ?? role),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Cancel')),
            FilledButton(
              onPressed: () async {
                try {
                  await UserService().createUser({
                    'first_name': first.text,
                    'last_name': last.text,
                    'email': email.text,
                    'username': user.text,
                    'password': pass.text,
                    'role': role,
                  });
                  if (ctx.mounted) Navigator.pop(ctx);
                  await _load();
                } catch (e) {
                  if (ctx.mounted) {
                    ScaffoldMessenger.of(ctx).showSnackBar(
                      SnackBar(content: Text(e.toString())),
                    );
                  }
                }
              },
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
  }
}
