import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/svg.dart';
import 'package:graduation_project/core/theme/app_theme.dart';

class AppInput extends StatefulWidget {
  final String? label, hint, suffixIcon, prefixIcon;
  final IconData? prefixIconData;
  final String? initialValue;
  final Color? color;
  final bool withCuntryCode;
  final bool isPassword;
  final TextInputType keyboardType;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final List<TextInputFormatter>? inputFormatters;

  const AppInput({
    super.key,
    this.label,
    this.hint,
    this.suffixIcon,
    this.prefixIcon,
    this.prefixIconData,
    this.initialValue,
    this.withCuntryCode = false,
    this.color,
    this.isPassword = false,
    this.keyboardType = TextInputType.text,
    this.controller,
    this.validator,
    this.inputFormatters,
  });

  @override
  State<AppInput> createState() => _AppInputState();
}

class _AppInputState extends State<AppInput> {
  late int selectedCountryCode;
  final list = [
    966,
    971,
    965,
    974,
    968,
    973,
    20,
  ]; // Common Arabic country codes
  bool _obscureText = true;

  @override
  void initState() {
    super.initState();
    selectedCountryCode = list.first;
    _obscureText = widget.isPassword;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface,
              fontSize: 14,
              fontWeight: FontWeight.w400,
              fontFamily: 'Inter',
            ),
          ),
          const SizedBox(height: 8),
        ],
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.withCuntryCode)
              Container(
                height: 50,
                margin: const EdgeInsetsDirectional.only(end: 8),
                decoration: BoxDecoration(
                  border: Border.all(color: Theme.of(context).colorScheme.outline),
                  borderRadius: BorderRadius.circular(12),
                  color: Theme.of(context).colorScheme.surface,
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<int>(
                    value: selectedCountryCode,
                    icon: Icon(
                      Icons.keyboard_arrow_down,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    items:
                        list
                            .map(
                              (e) => DropdownMenuItem(
                                value: e,
                                child: Text(
                                  "+$e",
                                  textDirection: TextDirection.ltr,
                                ),
                              ),
                            )
                            .toList(),
                    onChanged: (value) {
                      setState(() {
                        selectedCountryCode = value!;
                      });
                    },
                    dropdownColor: Theme.of(context).colorScheme.surface,
                  ),
                ),
              ),
            Expanded(
              child: TextFormField(
                controller: widget.controller,
                initialValue: widget.initialValue,
                keyboardType: widget.keyboardType,
                obscureText: _obscureText,
                validator: widget.validator,
                inputFormatters: widget.inputFormatters,
                style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 16),
                decoration: InputDecoration(
                  hintText: widget.hint,
                  prefixIcon:
                      widget.prefixIcon != null
                          ? Padding(
                            padding: const EdgeInsets.all(12),
                            child: SvgPicture.asset(
                              widget.prefixIcon!,
                              colorFilter: ColorFilter.mode(
                                Theme.of(context).colorScheme.onSurfaceVariant,
                                BlendMode.srcIn,
                              ),
                            ),
                          )
                          : widget.prefixIconData != null
                          ? Icon(
                            widget.prefixIconData,
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          )
                          : null,
                  suffixIcon:
                      widget.isPassword
                          ? IconButton(
                            icon: Icon(
                              _obscureText
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                              color: const Color(0xff94A3B8),
                            ),
                            onPressed: () {
                              setState(() {
                                _obscureText = !_obscureText;
                              });
                            },
                          )
                          : widget.suffixIcon != null
                          ? Padding(
                            padding: const EdgeInsets.all(12),
                            child: SvgPicture.asset(
                              widget.suffixIcon!,
                              colorFilter: ColorFilter.mode(
                                Theme.of(context).colorScheme.onSurfaceVariant,
                                BlendMode.srcIn,
                              ),
                            ),
                          )
                          : null,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
