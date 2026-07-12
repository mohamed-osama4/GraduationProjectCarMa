import 'package:flutter/material.dart';
import 'package:graduation_project/core/localization/app_strings.dart';
import 'package:graduation_project/core/theme/app_theme.dart';
import 'package:graduation_project/logic/providers/locale_provider.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

class DateTimePickerCard extends StatefulWidget {
  final Function(DateTime) onDateTimeSelected;
  const DateTimePickerCard({super.key, required this.onDateTimeSelected});

  @override
  State<DateTimePickerCard> createState() => _DateTimePickerCardState();
}

class _DateTimePickerCardState extends State<DateTimePickerCard> {
  DateTime? selectedDate;

  void _showPicker() {
    showDialog(
      context: context,
      builder: (context) => _DateTimePickerDialog(
        initialDate: selectedDate ?? DateTime.now().add(const Duration(hours: 1)),
        onSelected: (date) {
          setState(() {
            selectedDate = date;
          });
          widget.onDateTimeSelected(date);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    String displayDate = s.isArabic ? 'اختر اليوم' : 'Select Day';
    String displayDay = s.isArabic ? 'والوقت' : 'and Time';
    String displayTime = '--:--';
    
    if (selectedDate != null) {
      displayDate = DateFormat('MMM dd', s.isArabic ? 'ar' : 'en').format(selectedDate!);
      displayDay = DateFormat('EEEE', s.isArabic ? 'ar' : 'en').format(selectedDate!);
      displayTime = DateFormat('hh:mm a', s.isArabic ? 'ar' : 'en').format(selectedDate!);
    }

    return GestureDetector(
      onTap: _showPicker,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF14161A) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withAlpha(20), width: 1),
          boxShadow: [
            if (isDark)
              BoxShadow(
                color: AppTheme.carmaGold.withAlpha(50),
                blurRadius: 30,
                offset: const Offset(0, 10),
              )
            else
              BoxShadow(
                color: Colors.black.withAlpha(10),
                blurRadius: 10,
              )
          ],
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              isDark ? const Color(0xFF14161A) : Colors.white,
              isDark ? const Color(0xFF14161A) : Colors.white,
              isDark ? AppTheme.carmaGold.withAlpha(60) : AppTheme.carmaGold.withAlpha(20),
            ],
            stops: const [0.0, 0.7, 1.0],
          ),
        ),
        child: Row(
          children: [
            Expanded(
              flex: 4,
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: isDark ? Colors.white.withAlpha(10) : AppTheme.carmaGold.withAlpha(30),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    Text(
                      displayDate,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      displayDay,
                      style: TextStyle(
                        fontSize: 14,
                        color: isDark ? Colors.white70 : Colors.black54,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              flex: 5,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    s.isArabic ? 'موعد الخدمة' : 'SERVICE TIME',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                      color: isDark ? Colors.white54 : Colors.black45,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        width: 3,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppTheme.carmaGold,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            selectedDate != null ? (s.isArabic ? 'الموعد المحدد' : 'Selected Time') : (s.isArabic ? 'لم يتم التحديد' : 'Not set'),
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: isDark ? Colors.white : Colors.black87,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            displayTime,
                            style: const TextStyle(
                              fontSize: 13,
                              color: AppTheme.carmaGold,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDark ? Colors.white.withAlpha(10) : AppTheme.carmaGold.withAlpha(30),
              ),
              child: const Icon(Icons.add, color: AppTheme.carmaGold, size: 20),
            )
          ],
        ),
      ),
    );
  }
}

class _DateTimePickerDialog extends StatefulWidget {
  final DateTime initialDate;
  final Function(DateTime) onSelected;

  const _DateTimePickerDialog({
    required this.initialDate,
    required this.onSelected,
  });

  @override
  State<_DateTimePickerDialog> createState() => _DateTimePickerDialogState();
}

class _DateTimePickerDialogState extends State<_DateTimePickerDialog> {
  late DateTime currentMonth;
  late DateTime selectedDate;
  late TimeOfDay selectedTime;

  final List<String> weekdaysEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  final List<String> weekdaysAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  final List<TimeOfDay> timeSlots = [];

  @override
  void initState() {
    super.initState();
    selectedDate = DateTime(widget.initialDate.year, widget.initialDate.month, widget.initialDate.day);
    currentMonth = DateTime(selectedDate.year, selectedDate.month, 1);
    
    // Nearest 30 min slot
    int min = widget.initialDate.minute;
    int hour = widget.initialDate.hour;
    if (min < 15) min = 0;
    else if (min < 45) min = 30;
    else { min = 0; hour++; }
    selectedTime = TimeOfDay(hour: hour, minute: min);

    // Generate times for the full 24 hours every 30 mins
    for (int h = 0; h < 24; h++) {
      timeSlots.add(TimeOfDay(hour: h, minute: 0));
      timeSlots.add(TimeOfDay(hour: h, minute: 30));
    }
    
    // If selected time is not in slots, select nearest
    if (!timeSlots.contains(selectedTime)) {
      selectedTime = TimeOfDay(hour: selectedTime.hour, minute: selectedTime.minute < 30 ? 0 : 30);
    }
  }

  int getDaysInMonth(int year, int month) {
    if (month == 2) {
      bool isLeapYear = (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
      return isLeapYear ? 29 : 28;
    }
    const daysInMonth = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
  }

  @override
  Widget build(BuildContext context) {
    final s = appStrings(context.watch<LocaleProvider>().isArabic);
    final weekdays = s.isArabic ? weekdaysAr : weekdaysEn;
    
    final int daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
    final int firstWeekday = currentMonth.weekday; // 1=Mon, 7=Sun
    final int emptyCells = firstWeekday == 7 ? 0 : firstWeekday; // If Sun is first col

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: const Color(0xFF1E2128),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withAlpha(20), width: 1),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Calendar and Time Area
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Left side: Calendar
                Expanded(
                  flex: 2,
                  child: Column(
                    children: [
                      // Month Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                currentMonth = DateTime(currentMonth.year, currentMonth.month - 1, 1);
                              });
                            },
                            child: const Icon(Icons.chevron_left, color: Colors.white, size: 24),
                          ),
                          Text(
                            DateFormat('MMMM yyyy', s.isArabic ? 'ar' : 'en').format(currentMonth),
                            style: const TextStyle(
                              color: AppTheme.carmaGold,
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                currentMonth = DateTime(currentMonth.year, currentMonth.month + 1, 1);
                              });
                            },
                            child: const Icon(Icons.chevron_right, color: Colors.white, size: 24),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Weekdays
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: weekdays.map((w) => Text(
                          w,
                          style: TextStyle(color: Colors.white.withAlpha(100), fontSize: 10, fontWeight: FontWeight.bold),
                        )).toList(),
                      ),
                      const SizedBox(height: 8),
                      // Grid
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: emptyCells + daysInMonth,
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 7,
                          mainAxisSpacing: 8,
                          crossAxisSpacing: 4,
                        ),
                        itemBuilder: (context, index) {
                          if (index < emptyCells) return const SizedBox();
                          int day = index - emptyCells + 1;
                          DateTime date = DateTime(currentMonth.year, currentMonth.month, day);
                          bool isSelected = date.year == selectedDate.year && date.month == selectedDate.month && date.day == selectedDate.day;
                          bool isToday = date.year == DateTime.now().year && date.month == DateTime.now().month && date.day == DateTime.now().day;
                          bool isPast = date.isBefore(DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day));

                          return GestureDetector(
                            onTap: isPast ? null : () {
                              setState(() {
                                selectedDate = date;
                              });
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                color: isSelected ? AppTheme.carmaGold : Colors.transparent,
                                shape: BoxShape.circle,
                                border: isToday && !isSelected ? Border.all(color: AppTheme.carmaGold) : null,
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                day.toString(),
                                style: TextStyle(
                                  color: isPast 
                                      ? Colors.white.withAlpha(50) 
                                      : (isSelected ? Colors.black : Colors.white),
                                  fontWeight: isSelected || isToday ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Container(width: 1, height: 240, color: Colors.white.withAlpha(20)),
                const SizedBox(width: 16),
                // Right side: Time
                Expanded(
                  flex: 1,
                  child: Column(
                    children: [
                      Text(
                        s.isArabic ? 'الوقت' : 'Time',
                        style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 220,
                        child: ListView.builder(
                          physics: const BouncingScrollPhysics(),
                          itemCount: timeSlots.length,
                          itemBuilder: (context, index) {
                            final t = timeSlots[index];
                            bool isSelected = t == selectedTime;
                            
                            // Format time
                            final now = DateTime.now();
                            final dt = DateTime(now.year, now.month, now.day, t.hour, t.minute);
                            final timeStr = DateFormat('h:mm a', s.isArabic ? 'ar' : 'en').format(dt);

                            return GestureDetector(
                              onTap: () {
                                setState(() {
                                  selectedTime = t;
                                });
                              },
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.symmetric(vertical: 8),
                                decoration: BoxDecoration(
                                  color: isSelected ? AppTheme.carmaGold.withAlpha(30) : Colors.transparent,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: isSelected ? AppTheme.carmaGold : Colors.transparent,
                                  ),
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  timeStr,
                                  style: TextStyle(
                                    color: isSelected ? AppTheme.carmaGold : Colors.white,
                                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      )
                    ],
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            // Bottom Summary and Button
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withAlpha(10),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.black45,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        Text(
                          DateFormat('MMM', s.isArabic ? 'ar' : 'en').format(selectedDate).toUpperCase(),
                          style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          selectedDate.day.toString(),
                          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          s.isArabic ? 'تأكيد الموعد' : 'Confirm Service',
                          style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          DateFormat('h:mm a', s.isArabic ? 'ar' : 'en').format(
                            DateTime(2020, 1, 1, selectedTime.hour, selectedTime.minute)
                          ),
                          style: const TextStyle(color: Colors.white54, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      final finalDateTime = DateTime(
                        selectedDate.year,
                        selectedDate.month,
                        selectedDate.day,
                        selectedTime.hour,
                        selectedTime.minute,
                      );
                      widget.onSelected(finalDateTime);
                      Navigator.pop(context);
                    },
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.carmaGold,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.check, color: Colors.black, size: 20),
                    ),
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
