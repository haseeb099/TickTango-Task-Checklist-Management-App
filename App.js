import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  Keyboard,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const initialChecks = [
  {
    id: '1',
    name: 'Complete onboarding paperwork',
    role: 'employee',
    frequency: 'once',
    priority: 'medium',
    completed: false,
    approved: false,
    dueDate: '2025-05-01',
    description: '',
    image: null,
    category: 'HR',
  },
  {
    id: '2',
    name: 'Conduct team briefing',
    role: 'supervisor',
    frequency: 'daily',
    priority: 'high',
    completed: true,
    approved: false,
    dueDate: '2025-04-29',
    description: '',
    image: null,
    category: 'Operations',
  },
  {
    id: '3',
    name: 'Review weekly reports',
    role: 'supervisor',
    frequency: 'weekly',
    priority: 'medium',
    completed: false,
    approved: false,
    dueDate: '2025-05-03',
    description: '',
    image: null,
    category: 'Operations',
  },
  {
    id: '4',
    name: 'Update compliance records',
    role: 'employee',
    frequency: 'monthly',
    priority: 'high',
    completed: false,
    approved: false,
    dueDate: '2025-05-31',
    description: '',
    image: null,
    category: 'Compliance',
  },
  {
    id: '5',
    name: 'Approve budget',
    role: 'manager',
    frequency: 'monthly',
    priority: 'high',
    completed: true,
    approved: true,
    dueDate: '2025-05-31',
    description: '',
    image: null,
    category: 'Finance',
  },
  {
    id: '6',
    name: 'Perform safety inspection',
    role: 'supervisor',
    frequency: 'weekly',
    priority: 'medium',
    completed: false,
    approved: false,
    dueDate: '2025-05-03',
    description: '',
    image: null,
    category: 'Safety',
  },
  {
    id: '7',
    name: 'Submit timesheet',
    role: 'employee',
    frequency: 'weekly',
    priority: 'low',
    completed: true,
    approved: false,
    dueDate: '2025-05-03',
    description: '',
    image: null,
    category: 'HR',
  },
];

const users = [
  { username: 'employee', password: 'emp123', role: 'employee' },
  { username: 'supervisor', password: 'sup123', role: 'supervisor' },
  { username: 'manager', password: 'man123', role: 'manager' },
];

const LoginScreen = React.memo(({ handleLogin, username, setUsername, password, setPassword, loginError }) => {
  const onChangeUsername = useCallback((text) => setUsername(text), [setUsername]);
  const onChangePassword = useCallback((text) => setPassword(text), [setPassword]);

  return (
    <View style={[styles.container, styles.loginContainer]} key="login-screen">
      <Text style={styles.title}>Tick Tango - Login</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={onChangeUsername}
          placeholder="Username (e.g., employee)"
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
          key="username-input"
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={onChangePassword}
          placeholder="Password (e.g., emp123)"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
          key="password-input"
        />
      </View>
      <Pressable onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
    </View>
  );
});

const TasksTab = React.memo(({ checks, userRole, search, setSearch, filter, setFilter, sort, setSort, page, setPage, toggleComplete, toggleApprove, deleteCheck, getReminder }) => {
  const onChangeSearch = useCallback((text) => setSearch(text), [setSearch]);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const filters = [
    { label: 'All Checks', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Uncompleted', value: 'uncompleted' },
    { label: 'Approved', value: 'approved' },
    { label: 'Unapproved', value: 'unapproved' },
    ...(userRole === 'employee' ? [] : [
      { label: 'Employee', value: 'employee' },
      { label: 'Supervisor', value: 'supervisor' },
      { label: 'Manager', value: 'manager' },
    ]),
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Low Priority', value: 'low' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'High Priority', value: 'high' },
  ];
  const sorts = [
    { label: 'By Name', value: 'name' },
    { label: 'By Completion', value: 'completed' },
    { label: 'By Approval', value: 'approved' },
    { label: 'By Priority', value: 'priority' },
  ];

  const filteredChecks = checks.filter(check => {
    if (userRole === 'employee' && check.role !== 'employee') return false;
    if (userRole === 'supervisor' && check.role === 'manager') return false;
    if (search && !check.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'completed') return check.completed;
    if (filter === 'uncompleted') return !check.completed;
    if (filter === 'approved') return check.approved;
    if (filter === 'unapproved') return !check.approved;
    if (filter === 'employee') return check.role === 'employee';
    if (filter === 'supervisor') return check.role === 'supervisor';
    if (filter === 'manager') return check.role === 'manager';
    if (filter === 'daily') return check.frequency === 'daily';
    if (filter === 'weekly') return check.frequency === 'weekly';
    if (filter === 'monthly') return check.frequency === 'monthly';
    if (filter === 'low') return check.priority === 'low';
    if (filter === 'medium') return check.priority === 'medium';
    if (filter === 'high') return check.priority === 'high';
    return true;
  });

  const sortedChecks = [...filteredChecks].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'completed') return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
    if (sort === 'approved') return a.approved === b.approved ? 0 : a.approved ? -1 : 1;
    if (sort === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  const tasksPerPage = 4;
  const paginatedChecks = sortedChecks.slice((page - 1) * tasksPerPage, page * tasksPerPage);
  const totalPages = Math.ceil(sortedChecks.length / tasksPerPage);

  const CustomDropdown = ({ options, selectedValue, onSelect, isOpen, setIsOpen, labelKey, valueKey }) => {
    const scaleAnim = useState(new Animated.Value(0))[0];

    React.useEffect(() => {
      Animated.timing(scaleAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isOpen, scaleAnim]);

    return (
      <View style={styles.dropdownContainer}>
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={({ pressed }) => [
            styles.dropdownButton,
            pressed && styles.dropdownButtonPressed,
          ]}
        >
          <Text style={styles.dropdownText}>
            {options.find(opt => (valueKey ? opt[valueKey] : opt) === selectedValue)?.[labelKey] || selectedValue}
          </Text>
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
        </Pressable>
        {isOpen && (
          <Animated.View
            style={[
              styles.dropdownMenu,
              {
                opacity: scaleAnim,
                transform: [{ scaleY: scaleAnim }],
              },
            ]}
          >
            {options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  onSelect(valueKey ? option[valueKey] : option);
                  setIsOpen(false);
                }}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  pressed && styles.dropdownItemPressed,
                ]}
              >
                <Text style={styles.dropdownItemText}>{labelKey ? option[labelKey] : option}</Text>
              </Pressable>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.tabContainer} key="tasks-tab" contentContainerStyle={styles.tabContent}>
      <View style={styles.searchContainer} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={onChangeSearch}
          placeholder="Search checks..."
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
          key="search-input"
        />
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
      </View>

      {userRole !== 'employee' && (
        <View style={styles.controls}>
          <View style={styles.control}>
            <Text style={styles.controlLabel}>Filter:</Text>
            <CustomDropdown
              options={filters}
              selectedValue={filter}
              onSelect={(value) => {
                setFilter(value);
                setPage(1);
              }}
              isOpen={filterDropdownOpen}
              setIsOpen={setFilterDropdownOpen}
              labelKey="label"
              valueKey="value"
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.controlLabel}>Sort:</Text>
            <CustomDropdown
              options={sorts}
              selectedValue={sort}
              onSelect={(value) => {
                setSort(value);
                setPage(1);
              }}
              isOpen={sortDropdownOpen}
              setIsOpen={setSortDropdownOpen}
              labelKey="label"
              valueKey="value"
            />
          </View>
        </View>
      )}

      <FlatList
        data={paginatedChecks}
        renderItem={({ item }) => (
          <View style={styles.task} key={item.id}>
            <View style={styles.taskContent}>
              <Pressable
                onPress={() => toggleComplete(item.id)}
                disabled={
                  !(userRole === 'employee' && item.role === 'employee') &&
                  !(userRole === 'supervisor' && item.role === 'supervisor') &&
                  !(userRole === 'manager')
                }
                style={({ pressed }) => [pressed && styles.buttonPressed]}
              >
                <Ionicons
                  name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={item.completed ? '#4CAF50' : '#666'}
                />
              </Pressable>
              <View style={styles.taskDetails}>
                <Text style={[styles.taskText, item.completed && styles.completed]}>
                  {item.name}
                </Text>
                <Text style={styles.taskMeta}>
                  {item.role.charAt(0).toUpperCase() + item.role.slice(1)} | {item.frequency} | {item.priority} | Due: {item.dueDate} | {getReminder(item)}
                </Text>
                {item.description && <Text style={styles.taskDescription}>{item.description}</Text>}
                {item.image && <Image source={{ uri: item.image }} style={styles.taskImage} />}
              </View>
            </View>
            <View style={styles.taskActions}>
              {(userRole === 'supervisor' || userRole === 'manager') && (
                <Pressable
                  onPress={() => toggleApprove(item.id)}
                  disabled={
                    !(userRole === 'supervisor' && item.role === 'employee') &&
                    !(userRole === 'manager' && (item.role === 'employee' || item.role === 'supervisor'))
                  }
                  style={({ pressed }) => [pressed && styles.buttonPressed]}
                >
                  <Ionicons
                    name={item.approved ? 'shield-checkmark' : 'shield-outline'}
                    size={24}
                    color={item.approved ? '#2196F3' : '#666'}
                  />
                </Pressable>
              )}
              {userRole === 'manager' && (
                <Pressable
                  onPress={() => deleteCheck(item.id)}
                  style={({ pressed }) => [pressed && styles.buttonPressed]}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF4444" />
                </Pressable>
              )}
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        style={styles.list}
        scrollEnabled={false}
      />

      <View style={styles.pagination}>
        <Pressable
          onPress={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
          style={({ pressed }) => [
            styles.pageButton,
            page === 1 && styles.disabled,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.pageButtonText}>Prev</Text>
        </Pressable>
        <Text style={styles.pageText}>Page {page} of {totalPages}</Text>
        <Pressable
          onPress={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
          style={({ pressed }) => [
            styles.pageButton,
            page === totalPages && styles.disabled,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
});

const AddCheckTab = React.memo(({ userRole, addCheck }) => {
  const [newCheck, setNewCheck] = useState('');
  const [newCheckRole, setNewCheckRole] = useState('employee');
  const [newCheckFrequency, setNewCheckFrequency] = useState('daily');
  const [newCheckPriority, setNewCheckPriority] = useState('medium');
  const [newCheckCategory, setNewCheckCategory] = useState('General');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [frequencyDropdownOpen, setFrequencyDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const roles = ['manager', 'supervisor', 'employee'];
  const frequencies = ['daily', 'weekly', 'monthly', 'once'];
  const priorities = ['low', 'medium', 'high'];
  const categories = ['General', 'HR', 'Operations', 'Finance', 'Safety', 'Compliance'];

  React.useEffect(() => {
    if (successMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setSuccessMessage(''));
        }, 3000);
      });
    }
  }, [successMessage, fadeAnim]);

  const validateForm = () => {
    const newErrors = {};
    if (!newCheck.trim()) newErrors.name = 'Task name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCheck = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addCheck({
        name: newCheck,
        role: newCheckRole,
        frequency: newCheckFrequency,
        priority: newCheckPriority,
        category: newCheckCategory,
        dueDate: dueDate.toISOString().split('T')[0],
        description,
        image,
      });

      setSuccessMessage('Task added successfully!');
      setNewCheck('');
      setNewCheckRole('employee');
      setNewCheckFrequency('daily');
      setNewCheckPriority('medium');
      setNewCheckCategory('General');
      setDueDate(new Date());
      setDescription('');
      setImage(null);
    } catch (error) {
      setErrors({ submit: 'Failed to add task. Please try again.' });
    } finally {
      setIsSubmitting(false);
      Keyboard.dismiss();
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setErrors({ image: 'Permission to access gallery was denied' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const CustomDropdown = ({ options, selectedValue, onSelect, isOpen, setIsOpen, label }) => {
    const scaleAnim = useState(new Animated.Value(0))[0];

    React.useEffect(() => {
      Animated.timing(scaleAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isOpen, scaleAnim]);

    return (
      <View style={styles.dropdownContainer}>
        <Text style={styles.controlLabel}>{label}</Text>
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={({ pressed }) => [
            styles.dropdownButton,
            pressed && styles.dropdownButtonPressed,
          ]}
        >
          <Text style={styles.dropdownText}>{selectedValue}</Text>
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
        </Pressable>
        {isOpen && (
          <Animated.View
            style={[
              styles.dropdownMenu,
              {
                opacity: scaleAnim,
                transform: [{ scaleY: scaleAnim }],
              },
            ]}
          >
            {options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  pressed && styles.dropdownItemPressed,
                ]}
              >
                <Text style={styles.dropdownItemText}>{option}</Text>
              </Pressable>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.tabContainer} key="add-check-tab" contentContainerStyle={styles.tabContent}>
      <View style={styles.formHeader}>
        <Ionicons name="add-circle" size={32} color="#4CAF50" />
        <Text style={styles.tabTitle}>Create New Task</Text>
      </View>

      {successMessage ? (
        <Animated.View style={[styles.successMessage, { opacity: fadeAnim }]}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.successText}>{successMessage}</Text>
        </Animated.View>
      ) : null}

      <View style={styles.formGroup}>
        <Text style={styles.controlLabel}>Task Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={newCheck}
          onChangeText={setNewCheck}
          placeholder="Enter task name"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.controlLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description"
          multiline
          numberOfLines={4}
          autoCapitalize="sentences"
          autoCorrect={true}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      <View style={styles.formRow}>
        <CustomDropdown
          options={roles}
          selectedValue={newCheckRole}
          onSelect={setNewCheckRole}
          isOpen={roleDropdownOpen}
          setIsOpen={setRoleDropdownOpen}
          label="Role"
        />
        <CustomDropdown
          options={frequencies}
          selectedValue={newCheckFrequency}
          onSelect={setNewCheckFrequency}
          isOpen={frequencyDropdownOpen}
          setIsOpen={setFrequencyDropdownOpen}
          label="Frequency"
        />
      </View>

      <View style={styles.formRow}>
        <CustomDropdown
          options={priorities}
          selectedValue={newCheckPriority}
          onSelect={setNewCheckPriority}
          isOpen={priorityDropdownOpen}
          setIsOpen={setPriorityDropdownOpen}
          label="Priority"
        />
        <CustomDropdown
          options={categories}
          selectedValue={newCheckCategory}
          onSelect={setNewCheckCategory}
          isOpen={categoryDropdownOpen}
          setIsOpen={setCategoryDropdownOpen}
          label="Category"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.controlLabel}>Due Date</Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={({ pressed }) => [
            styles.dateButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={styles.dateText}>{dueDate.toLocaleDateString()}</Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.controlLabel}>Task Image (Optional)</Text>
        <TouchableOpacity
          onPress={pickImage}
          style={({ pressed }) => [
            styles.imagePicker,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons name="image" size={24} color="#666" />
          <Text style={styles.imagePickerText}>{image ? 'Change Image' : 'Select Image'}</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
      </View>

      {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

      <TouchableOpacity
        onPress={handleAddCheck}
        style={({ pressed }) => [
          styles.addButton,
          isSubmitting && styles.disabledButton,
          pressed && styles.buttonPressed,
        ]}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.buttonText}>Create Task</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
});

const StatsTab = React.memo(({ filteredChecks, userRole }) => {
  const totalChecks = filteredChecks.length;
  const completedChecks = filteredChecks.filter(c => c.completed).length;
  const approvedChecks = filteredChecks.filter(c => c.approved).length;
  const byRole = {
    employee: filteredChecks.filter(c => c.role === 'employee').length,
    supervisor: filteredChecks.filter(c => c.role === 'supervisor').length,
    manager: filteredChecks.filter(c => c.role === 'manager').length,
  };
  const byFrequency = {
    daily: filteredChecks.filter(c => c.frequency === 'daily').length,
    weekly: filteredChecks.filter(c => c.frequency === 'weekly').length,
    monthly: filteredChecks.filter(c => c.frequency === 'monthly').length,
    once: filteredChecks.filter(c => c.frequency === 'once').length,
  };
  const byCategory = {
    General: filteredChecks.filter(c => c.category === 'General').length,
    HR: filteredChecks.filter(c => c.category === 'HR').length,
    Operations: filteredChecks.filter(c => c.category === 'Operations').length,
    Finance: filteredChecks.filter(c => c.category === 'Finance').length,
    Safety: filteredChecks.filter(c => c.category === 'Safety').length,
    Compliance: filteredChecks.filter(c => c.category === 'Compliance').length,
  };

  return (
    <ScrollView style={styles.tabContainer} key="stats-tab" contentContainerStyle={styles.tabContent}>
      <Text style={styles.tabTitle}>Check Statistics</Text>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total Checks: {totalChecks}</Text>
        <Text style={styles.statLabel}>Completed: {completedChecks} ({totalChecks ? ((completedChecks / totalChecks) * 100).toFixed(1) : 0}%)</Text>
        <Text style={styles.statLabel}>Approved: {approvedChecks} ({totalChecks ? ((approvedChecks / totalChecks) * 100).toFixed(1) : 0}%)</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>By Role:</Text>
        <Text style={styles.statSubLabel}>Employee: {byRole.employee}</Text>
        <Text style={styles.statSubLabel}>Supervisor: {byRole.supervisor}</Text>
        <Text style={styles.statSubLabel}>Manager: {byRole.manager}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>By Frequency:</Text>
        <Text style={styles.statSubLabel}>Daily: {byFrequency.daily}</Text>
        <Text style={styles.statSubLabel}>Weekly: {byFrequency.weekly}</Text>
        <Text style={styles.statSubLabel}>Monthly: {byFrequency.monthly}</Text>
        <Text style={styles.statSubLabel}>One-time: {byFrequency.once}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>By Category:</Text>
        <Text style={styles.statSubLabel}>General: {byCategory.General}</Text>
        <Text style={styles.statSubLabel}>HR: {byCategory.HR}</Text>
        <Text style={styles.statSubLabel}>Operations: {byCategory.Operations}</Text>
        <Text style={styles.statSubLabel}>Finance: {byCategory.Finance}</Text>
        <Text style={styles.statSubLabel}>Safety: {byCategory.Safety}</Text>
        <Text style={styles.statSubLabel}>Compliance: {byCategory.Compliance}</Text>
      </View>
    </ScrollView>
  );
});

export default function App() {
  const [checks, setChecks] = useState(initialChecks);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');

  const handleLogin = useCallback(() => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setUserRole(user.role);
      setLoginError('');
      setUsername('');
      setPassword('');
      Keyboard.dismiss();
    } else {
      setLoginError('Invalid username or password');
    }
  }, [username, password]);

  const handleLogout = useCallback(() => {
    setUserRole(null);
    setActiveTab('tasks');
    setFilter('all');
    setSort('name');
    setPage(1);
    setSearch('');
  }, []);

  const addCheck = useCallback(async (checkData) => {
    if (userRole === 'manager') {
      setChecks(prevChecks => [...prevChecks, {
        id: Date.now().toString(),
        completed: false,
        approved: false,
        ...checkData,
      }]);
    }
  }, [userRole]);

  const toggleComplete = useCallback((id) => {
    setChecks(prevChecks => prevChecks.map(check => {
      if (check.id !== id) return check;
      const canComplete =
        (userRole === 'employee' && check.role === 'employee') ||
        (userRole === 'supervisor' && check.role === 'supervisor') ||
        userRole === 'manager';
      return canComplete ? { ...check, completed: !check.completed } : check;
    }));
  }, [userRole]);

  const toggleApprove = useCallback((id) => {
    setChecks(prevChecks => prevChecks.map(check => {
      if (check.id !== id) return check;
      const canApprove =
        (userRole === 'supervisor' && check.role === 'employee') ||
        (userRole === 'manager' && (check.role === 'employee' || check.role === 'supervisor'));
      return canApprove ? { ...check, approved: !check.approved } : check;
    }));
  }, [userRole]);

  const deleteCheck = useCallback((id) => {
    if (userRole === 'manager') {
      setChecks(prevChecks => prevChecks.filter(check => check.id !== id));
    }
  }, [userRole]);

  const getReminder = useCallback((check) => {
    if (!check.completed) {
      return check.frequency === 'daily' ? 'Due today!' :
             check.frequency === 'weekly' ? 'Due this week!' :
             check.frequency === 'monthly' ? 'Due this month!' : 'Due soon!';
    }
    return '';
  }, []);

  const filteredChecks = checks.filter(check => {
    if (userRole === 'employee' && check.role !== 'employee') return false;
    if (userRole === 'supervisor' && check.role === 'manager') return false;
    if (search && !check.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'completed') return check.completed;
    if (filter === 'uncompleted') return !check.completed;
    if (filter === 'approved') return check.approved;
    if (filter === 'unapproved') return !check.approved;
    if (filter === 'employee') return check.role === 'employee';
    if (filter === 'supervisor') return check.role === 'supervisor';
    if (filter === 'manager') return check.role === 'manager';
    if (filter === 'daily') return check.frequency === 'daily';
    if (filter === 'weekly') return check.frequency === 'weekly';
    if (filter === 'monthly') return check.frequency === 'monthly';
    if (filter === 'low') return check.priority === 'low';
    if (filter === 'medium') return check.priority === 'medium';
    if (filter === 'high') return check.priority === 'high';
    return true;
  });

  if (!userRole) {
    return (
      <LoginScreen
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        loginError={loginError}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.background, {
        backgroundColor: userRole === 'employee' ? '#e3f2fd' :
                        userRole === 'supervisor' ? '#e8f5e9' : '#f3e5f5'
      }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Tick Tango - {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</Text>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
        <View style={styles.tabBar}>
          <Pressable
            style={({ pressed }) => [
              styles.tabButton,
              activeTab === 'tasks' && styles.activeTab,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setActiveTab('tasks')}
          >
            <Text style={styles.tabLabel}>Tasks</Text>
          </Pressable>
          {userRole === 'manager' && (
            <Pressable
              style={({ pressed }) => [
                styles.tabButton,
                activeTab === 'add' && styles.activeTab,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setActiveTab('add')}
            >
              <Text style={styles.tabLabel}>Add Check</Text>
            </Pressable>
          )}
          {(userRole === 'supervisor' || userRole === 'manager') && (
            <Pressable
              style={({ pressed }) => [
                styles.tabButton,
                activeTab === 'stats' && styles.activeTab,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setActiveTab('stats')}
            >
              <Text style={styles.tabLabel}>Stats</Text>
            </Pressable>
          )}
        </View>
        {activeTab === 'tasks' && (
          <TasksTab
            checks={checks}
            userRole={userRole}
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            page={page}
            setPage={setPage}
            toggleComplete={toggleComplete}
            toggleApprove={toggleApprove}
            deleteCheck={deleteCheck}
            getReminder={getReminder}
          />
        )}
        {activeTab === 'add' && userRole === 'manager' && (
          <AddCheckTab
            userRole={userRole}
            addCheck={addCheck}
          />
        )}
        {activeTab === 'stats' && (userRole === 'supervisor' || userRole === 'manager') && (
          <StatsTab filteredChecks={filteredChecks} userRole={userRole} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  background: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  inputWrapper: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 2,
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'space-between',
    elevation: 2,
  },
  dropdownButtonPressed: {
    backgroundColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemPressed: {
    backgroundColor: '#e8f5e9',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabLabel: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  tabContent: {
    paddingBottom: 20,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 2,
  },
  searchIcon: {
    marginLeft: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  control: {
    flex: 1,
    marginHorizontal: 5,
  },
  list: {
    flexGrow: 0,
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 3,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskDetails: {
    marginLeft: 10,
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  taskImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 10,
  },
  pageButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 3,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pageText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 10,
    fontWeight: '500',
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  successText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 10,
    fontWeight: '500',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 3,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  statSubLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginBottom: 5,
  },
});