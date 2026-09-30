import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

interface DatePickerInputProps {
  label?: string;
  value?: string; // Expected format DD/MM/YYYY or YYYY-MM-DD
  onChangeDate: (dateStr: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  className?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DatePickerInput({
  label,
  value = '',
  onChangeDate,
  placeholder = 'DD/MM/YYYY',
  error,
  disabled = false,
  maxDate = new Date(),
  minDate = new Date(1920, 0, 1),
  className = '',
}: DatePickerInputProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'year' | 'month'>('calendar');

  // Parse incoming value
  const parseDate = (val: string) => {
    if (!val) return null;
    const clean = val.trim();
    // DD/MM/YYYY
    if (clean.includes('/')) {
      const parts = clean.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
          return new Date(y, m, d);
        }
      }
    }
    // YYYY-MM-DD
    if (clean.includes('-')) {
      const parts = clean.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
          return new Date(y, m, d);
        }
      }
    }
    return null;
  };

  const parsedValue = useMemo(() => parseDate(value), [value]);

  // Current calendar view state
  const defaultYear = parsedValue ? parsedValue.getFullYear() : (maxDate ? Math.min(2000, maxDate.getFullYear()) : 2000);
  const defaultMonth = parsedValue ? parsedValue.getMonth() : 0;
  const defaultDay = parsedValue ? parsedValue.getDate() : 1;

  const [currentYear, setCurrentYear] = useState(defaultYear);
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
  const [selectedDate, setSelectedDate] = useState<Date | null>(parsedValue);

  // Sync state when modal opens
  useEffect(() => {
    if (modalVisible) {
      const current = parseDate(value);
      if (current) {
        setSelectedDate(current);
        setCurrentYear(current.getFullYear());
        setCurrentMonth(current.getMonth());
      } else {
        const yr = maxDate ? Math.min(2000, maxDate.getFullYear()) : 2000;
        setCurrentYear(yr);
        setCurrentMonth(0);
        setSelectedDate(null);
      }
      setViewMode('calendar');
    }
  }, [modalVisible, value]);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar day calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handleSelectDay = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const yyyy = selectedDate.getFullYear();
      onChangeDate(`${dd}/${mm}/${yyyy}`);
    }
    setModalVisible(false);
  };

  // Years list (from maxDate year down to minDate year)
  const yearsList = useMemo(() => {
    const endYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear();
    const startYear = minDate ? minDate.getFullYear() : 1920;
    const years = [];
    for (let y = endYear; y >= startYear; y--) {
      years.push(y);
    }
    return years;
  }, [maxDate, minDate]);

  const borderClass = error
    ? 'border-error'
    : modalVisible
    ? 'border-primary'
    : 'border-border';

  return (
    <View className={`w-full mb-4 ${className}`}>
      {label && <Text className="text-dark font-inter-semibold mb-2">{label}</Text>}

      {/* Input Box Trigger */}
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.8}
        onPress={() => {
          if (!disabled) setModalVisible(true);
        }}
        className={`flex-row w-full ${
          disabled ? 'bg-gray-100/90 border-border/70' : 'bg-surface border ' + borderClass
        } rounded-md px-4 py-3 items-center justify-between`}
      >
        <Text
          className={`flex-1 text-base font-inter ${
            value ? 'text-dark font-inter-medium' : 'text-muted'
          }`}
        >
          {value || placeholder}
        </Text>

        <View className="ml-2 p-0.5">
          <CalendarDaysIcon size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {error && <Text className="text-error text-sm font-inter mt-1">{error}</Text>}

      {/* Calendar Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 bg-black/60 justify-center items-center px-4">
            <TouchableWithoutFeedback>
              <View className="w-full max-w-sm bg-surface rounded-2xl p-5 shadow-xl border border-border">
                
                {/* Modal Header */}
                <View className="flex-row items-center justify-between pb-3 border-b border-border mb-3">
                  {/* Month & Year Title Button */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setViewMode(viewMode === 'year' ? 'calendar' : 'year')}
                    className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-lg"
                  >
                    <Text className="text-sm font-inter-bold text-dark mr-1">
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </Text>
                    <ChevronDownIcon size={14} color={colors.dark} />
                  </TouchableOpacity>

                  {/* Mode switcher or close */}
                  <View className="flex-row items-center space-x-1">
                    <TouchableOpacity
                      onPress={() => setViewMode(viewMode === 'month' ? 'calendar' : 'month')}
                      className={`px-2.5 py-1 rounded-md mr-1 ${viewMode === 'month' ? 'bg-primary' : 'bg-gray-100'}`}
                    >
                      <Text className={`text-xs font-inter-semibold ${viewMode === 'month' ? 'text-dark' : 'text-muted'}`}>
                        Month
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      className="p-1 rounded-full bg-gray-100"
                    >
                      <XMarkIcon size={18} color={colors.dark} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* View 1: Calendar Grid */}
                {viewMode === 'calendar' && (
                  <View>
                    {/* Month Nav Buttons */}
                    <View className="flex-row items-center justify-between px-1 mb-3">
                      <TouchableOpacity
                        onPress={handlePrevMonth}
                        className="p-1.5 rounded-lg bg-gray-100"
                      >
                        <ChevronLeftIcon size={18} color={colors.dark} />
                      </TouchableOpacity>

                      <Text className="text-xs font-inter-medium text-muted">
                        Tap year above to jump quickly
                      </Text>

                      <TouchableOpacity
                        onPress={handleNextMonth}
                        className="p-1.5 rounded-lg bg-gray-100"
                      >
                        <ChevronRightIcon size={18} color={colors.dark} />
                      </TouchableOpacity>
                    </View>

                    {/* Weekday Headers */}
                    <View className="flex-row justify-between mb-2">
                      {WEEK_DAYS.map((wd, i) => (
                        <View key={i} className="w-10 items-center">
                          <Text className="text-xs font-inter-semibold text-muted">{wd}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Days Matrix */}
                    <View className="flex-row flex-wrap">
                      {/* Blank days before 1st of month */}
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <View key={`empty-${i}`} className="w-[14.28%] h-10" />
                      ))}

                      {/* Day Numbers */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const thisDate = new Date(currentYear, currentMonth, dayNum);
                        const isSelected =
                          selectedDate &&
                          selectedDate.getFullYear() === currentYear &&
                          selectedDate.getMonth() === currentMonth &&
                          selectedDate.getDate() === dayNum;

                        const isFuture = maxDate ? thisDate > maxDate : false;
                        const isPastMin = minDate ? thisDate < minDate : false;
                        const isDayDisabled = isFuture || isPastMin;

                        return (
                          <TouchableOpacity
                            key={`day-${dayNum}`}
                            disabled={isDayDisabled}
                            onPress={() => handleSelectDay(dayNum)}
                            className="w-[14.28%] h-10 items-center justify-center p-0.5"
                          >
                            <View
                              className={`w-8 h-8 rounded-full items-center justify-center ${
                                isSelected
                                  ? 'bg-[#11274c]'
                                  : isDayDisabled
                                  ? 'opacity-25'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <Text
                                className={`text-xs font-inter-medium ${
                                  isSelected
                                    ? 'text-white font-inter-bold'
                                    : isDayDisabled
                                    ? 'text-muted'
                                    : 'text-dark'
                                }`}
                              >
                                {dayNum}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* View 2: Year Selector Grid */}
                {viewMode === 'year' && (
                  <View>
                    <Text className="text-xs font-inter-semibold text-muted mb-2 px-1">
                      Select Birth Year:
                    </Text>
                    <ScrollView
                      className="h-60"
                      showsVerticalScrollIndicator={true}
                    >
                      <View className="flex-row flex-wrap justify-between">
                        {yearsList.map((y) => {
                          const isYearSelected = currentYear === y;
                          return (
                            <TouchableOpacity
                              key={y}
                              onPress={() => {
                                setCurrentYear(y);
                                setViewMode('calendar');
                              }}
                              className={`w-[23%] py-2.5 my-1 rounded-lg items-center ${
                                isYearSelected ? 'bg-[#11274c]' : 'bg-gray-100'
                              }`}
                            >
                              <Text
                                className={`text-xs font-inter-semibold ${
                                  isYearSelected ? 'text-white font-inter-bold' : 'text-dark'
                                }`}
                              >
                                {y}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                )}

                {/* View 3: Month Selector Grid */}
                {viewMode === 'month' && (
                  <View>
                    <Text className="text-xs font-inter-semibold text-muted mb-2 px-1">
                      Select Month:
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                      {SHORT_MONTHS.map((m, idx) => {
                        const isMonthSelected = currentMonth === idx;
                        return (
                          <TouchableOpacity
                            key={m}
                            onPress={() => {
                              setCurrentMonth(idx);
                              setViewMode('calendar');
                            }}
                            className={`w-[30%] py-3 my-1.5 rounded-lg items-center ${
                              isMonthSelected ? 'bg-[#11274c]' : 'bg-gray-100'
                            }`}
                          >
                            <Text
                              className={`text-xs font-inter-semibold ${
                                isMonthSelected ? 'text-white font-inter-bold' : 'text-dark'
                              }`}
                            >
                              {m}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Bottom Action Bar */}
                <View className="flex-row justify-end items-center mt-5 pt-3 border-t border-border space-x-2">
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100 mr-2"
                  >
                    <Text className="text-xs font-inter-semibold text-muted">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={!selectedDate}
                    className={`px-5 py-2 rounded-lg ${
                      selectedDate ? 'bg-[#11274c]' : 'bg-gray-200 opacity-50'
                    }`}
                  >
                    <Text className="text-xs font-inter-bold text-white">Select</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
