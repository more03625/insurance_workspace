bool isValidEmail(String v) {
  return RegExp(r'\S+@\S+\.\S+').hasMatch(v.trim());
}

bool isNonEmpty(String v) => v.trim().isNotEmpty;
