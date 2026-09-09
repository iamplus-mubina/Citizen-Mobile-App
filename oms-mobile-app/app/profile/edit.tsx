import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView, Alert, Switch, ActivityIndicator, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { citizenService } from '@/services/citizenService';
import type { MasterDropdownItem } from '@/services/types';

const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER'];
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'BOMBAY_BLOOD_GROUP_HH', 'PARA_BOMBAY'];
const CITY_TYPE_OPTIONS = ['CITY', 'VILLAGE'];
const EDUCATION_OPTIONS = ['UNDER_GRADUATE', 'GRADUATE', 'POST_GRADUATE'];
const RATION_CARD_OPTIONS = ['NO CARD', 'WHITE', 'YELLOW', 'ORANGE'];

export default function EditProfileScreen() {
  const router = useRouter();
  const store = useComplaintStore();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: '/home', params: { tab: 'profile' } });
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  // Basic Details
  const [firstName, setFirstName] = useState(store.firstName || (store.profileName ? store.profileName.split(' ')[0] : ''));
  const [middleName, setMiddleName] = useState(store.middleName || '');
  const [lastName, setLastName] = useState(store.lastName || (store.profileName ? store.profileName.split(' ').slice(1).join(' ') : ''));
  const [email, setEmail] = useState(store.profileEmail || '');
  const [address, setAddress] = useState(store.profileAddress || '');
  const [pincode, setPincode] = useState(store.profilePincode || '');
  const [city, setCity] = useState(store.city || '');
  const [cityType, setCityType] = useState(store.cityType || '');
  const [alternatePhone, setAlternatePhone] = useState(store.alternatePhone || '');
  const [phone3, setPhone3] = useState(store.phone3 || '');
  const [phone4, setPhone4] = useState(store.phone4 || '');

  // Personal Details
  const [gender, setGender] = useState(store.gender || '');
  const [dob, setDob] = useState(store.dob || '');
  const [age, setAge] = useState(store.age || '');
  const [bloodGroup, setBloodGroup] = useState(store.bloodGroup || '');
  const [education, setEducation] = useState(store.education || '');
  const [occupation, setOccupation] = useState(store.occupation || '');

  // Identity Documents
  const [aadharCard, setAadharCard] = useState(store.aadharCard || '');
  const [panCard, setPanCard] = useState(store.panCard || '');
  const [voterId, setVoterId] = useState(store.voterId || '');
  const [drivingLicence, setDrivingLicence] = useState(store.drivingLicence || '');
  const [rationCard, setRationCard] = useState(store.rationCard || '');

  // Location Details
  const [districtId, setDistrictId] = useState<number | null>(store.districtId);
  const [districtName, setDistrictName] = useState(store.districtName || '');
  const [assemblyId, setAssemblyId] = useState<number | null>(store.assemblyId);
  const [assemblyName, setAssemblyName] = useState(store.assemblyName || '');
  const [gaonId, setGaonId] = useState<number | null>(store.gaonId);
  const [gaonName, setGaonName] = useState(store.gaonName || '');
  const [ganId, setGanId] = useState<number | null>(store.ganId);
  const [ganName, setGanName] = useState(store.ganName || '');
  const [gatId, setGatId] = useState<number | null>(store.gatId);
  const [gatName, setGatName] = useState(store.gatName || '');
  const [prabhagId, setPrabhagId] = useState<number | null>(store.prabhagId);
  const [prabhagName, setPrabhagName] = useState(store.prabhagName || '');
  const [prabhagAreaId, setPrabhagAreaId] = useState<number | null>(store.prabhagAreaId);
  const [prabhagAreaName, setPrabhagAreaName] = useState(store.prabhagAreaName || '');

  // Caste & Religion
  const [religionId, setReligionId] = useState<number | null>(store.religionId);
  const [religionName, setReligionName] = useState(store.religionName || '');
  const [castId, setCastId] = useState<number | null>(store.castId);
  const [castName, setCastName] = useState(store.castName || store.caste || '');
  const [subCastId, setSubCastId] = useState<number | null>(store.subCastId);
  const [subCastName, setSubCastName] = useState(store.subCastName || store.subCaste || '');

  // Voter Details
  const [isVoter, setIsVoter] = useState(store.isVoter ?? false);
  const [acNumber, setAcNumber] = useState(store.acNumber || store.voterAccountNumber || '');
  const [voterPartNumber, setVoterPartNumber] = useState(store.voterPartNumber || '');
  const [voterSectionNumber, setVoterSectionNumber] = useState(store.voterSectionNumber || '');
  const [voterSlnNumber, setVoterSlnNumber] = useState(store.voterSlnNumber || '');
  const [boothNumber, setBoothNumber] = useState(store.boothNumber || '');
  const [boothName, setBoothName] = useState(store.boothName || '');
  const [note, setNote] = useState(store.note || '');

  // Master Lists
  const [districts, setDistricts] = useState<MasterDropdownItem[]>([]);
  const [assemblies, setAssemblies] = useState<MasterDropdownItem[]>([]);
  const [gaons, setGaons] = useState<MasterDropdownItem[]>([]);
  const [gans, setGans] = useState<MasterDropdownItem[]>([]);
  const [gats, setGats] = useState<MasterDropdownItem[]>([]);
  const [prabhags, setPrabhags] = useState<MasterDropdownItem[]>([]);
  const [prabhagAreas, setPrabhagAreas] = useState<MasterDropdownItem[]>([]);
  const [religions, setReligions] = useState<MasterDropdownItem[]>([]);
  const [casts, setCasts] = useState<MasterDropdownItem[]>([]);
  const [subCasts, setSubCasts] = useState<MasterDropdownItem[]>([]);

  const [loadingMaster, setLoadingMaster] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch Master Data on Mount
  useEffect(() => {
    let isMounted = true;
    const fetchMasters = async () => {
      setLoadingMaster(true);
      try {
        const [
          distRes,
          assemRes,
          gaonRes,
          ganRes,
          gatRes,
          prabRes,
          areaRes,
          religRes,
          castRes,
          subRes
        ] = await Promise.allSettled([
          citizenService.getDistricts(),
          citizenService.getAssemblies(),
          citizenService.getGaon(),
          citizenService.getGan(),
          citizenService.getGat(),
          citizenService.getPrabhag(),
          citizenService.getPrabhagArea(),
          citizenService.getReligion(),
          citizenService.getCast(),
          citizenService.getSubCast()
        ]);

        if (!isMounted) return;

        if (distRes.status === 'fulfilled' && Array.isArray(distRes.value)) setDistricts(distRes.value);
        if (assemRes.status === 'fulfilled' && Array.isArray(assemRes.value)) setAssemblies(assemRes.value);
        if (gaonRes.status === 'fulfilled' && Array.isArray(gaonRes.value)) setGaons(gaonRes.value);
        if (ganRes.status === 'fulfilled' && Array.isArray(ganRes.value)) setGans(ganRes.value);
        if (gatRes.status === 'fulfilled' && Array.isArray(gatRes.value)) setGats(gatRes.value);
        if (prabRes.status === 'fulfilled' && Array.isArray(prabRes.value)) setPrabhags(prabRes.value);
        if (areaRes.status === 'fulfilled' && Array.isArray(areaRes.value)) setPrabhagAreas(areaRes.value);
        if (religRes.status === 'fulfilled' && Array.isArray(religRes.value)) setReligions(religRes.value);
        if (castRes.status === 'fulfilled' && Array.isArray(castRes.value)) setCasts(castRes.value);
        if (subRes.status === 'fulfilled' && Array.isArray(subRes.value)) setSubCasts(subRes.value);

        // Fetch direct live profile from visitor table
        try {
          const fresh = await citizenService.getProfile();
          if (fresh && isMounted) {
            store.setProfileFromApi(fresh);
            if (fresh.firstName) setFirstName(fresh.firstName);
            if (fresh.middleName) setMiddleName(fresh.middleName);
            if (fresh.lastName) setLastName(fresh.lastName);
            if (fresh.email) setEmail(fresh.email);
            if (fresh.address) setAddress(fresh.address);
            if (fresh.pincode) setPincode(fresh.pincode);
            if (fresh.city) setCity(fresh.city);
            if (fresh.cityType) setCityType(fresh.cityType);
            if (fresh.alternatePhone) setAlternatePhone(fresh.alternatePhone);
            if (fresh.phone3) setPhone3(fresh.phone3);
            if (fresh.phone4) setPhone4(fresh.phone4);
            if (fresh.gender) setGender(fresh.gender);
            if (fresh.dob) setDob(fresh.dob);
            if (fresh.age) setAge(String(fresh.age));
            if (fresh.bloodGroup) setBloodGroup(fresh.bloodGroup);
            if (fresh.education) setEducation(fresh.education);
            if (fresh.occupation) setOccupation(fresh.occupation);
            if (fresh.aadhar) setAadharCard(fresh.aadhar);
            if (fresh.pancard) setPanCard(fresh.pancard);
            if (fresh.voterID) setVoterId(fresh.voterID);
            if (fresh.drivingLicence) setDrivingLicence(fresh.drivingLicence);
            if (fresh.rationCard) setRationCard(fresh.rationCard);
            if (fresh.isVoter !== undefined) setIsVoter(fresh.isVoter);
            if (fresh.acNumber) setAcNumber(fresh.acNumber);
            if (fresh.partNumber) setVoterPartNumber(fresh.partNumber);
            if (fresh.sectionNumber) setVoterSectionNumber(fresh.sectionNumber);
            if (fresh.boothNumber) setBoothNumber(fresh.boothNumber);
            if (fresh.boothName) setBoothName(fresh.boothName);
            if (fresh.note) setNote(fresh.note);
            if (fresh.assembly?.id) { setAssemblyId(fresh.assembly.id); setAssemblyName(fresh.assembly.name); }
            if (fresh.gaon?.id) { setGaonId(fresh.gaon.id); setGaonName(fresh.gaon.name); }
            if (fresh.gan_number?.id) { setGanId(fresh.gan_number.id); setGanName(fresh.gan_number.name); }
            if (fresh.gat_number?.id) { setGatId(fresh.gat_number.id); setGatName(fresh.gat_number.name); }
            if (fresh.prabhag?.id) { setPrabhagId(fresh.prabhag.id); setPrabhagName(fresh.prabhag.name); }
            if (fresh.prabhagArea?.id) { setPrabhagAreaId(fresh.prabhagArea.id); setPrabhagAreaName(fresh.prabhagArea.name); }
            if (fresh.religion?.id) { setReligionId(fresh.religion.id); setReligionName(fresh.religion.name); }
            if (fresh.cast?.id) { setCastId(fresh.cast.id); setCastName(fresh.cast.name); }
            if (fresh.subcast?.id) { setSubCastId(fresh.subcast.id); setSubCastName(fresh.subcast.name); }
          }
        } catch (e) {
          console.log('Error fetching fresh profile for edit:', e);
        }
      } catch (err) {
        console.warn('Failed to fetch master data:', err);
      } finally {
        if (isMounted) setLoadingMaster(false);
      }
    };

    fetchMasters();
    return () => { isMounted = false; };
  }, []);

  const handleSave = async () => {
    // All fields are optional! Only validate format if filled
    const newErrors: Record<string, string> = {};
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    if (pincode.trim() && pincode.trim().length !== 6) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: firstName.trim() || undefined,
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        pincode: pincode.trim() || undefined,
        city: city.trim() || undefined,
        cityType: cityType || undefined,
        alternatePhone: alternatePhone.trim() || undefined,
        phone3: phone3.trim() || undefined,
        phone4: phone4.trim() || undefined,
        gender: gender || undefined,
        dob: dob.trim() || undefined,
        age: age.trim() || undefined,
        bloodGroup: bloodGroup || undefined,
        education: education || undefined,
        occupation: occupation.trim() || undefined,
        aadhar: aadharCard.trim() || undefined,
        pancard: panCard.trim() || undefined,
        voterID: voterId.trim() || undefined,
        drivingLicence: drivingLicence.trim() || undefined,
        rationCard: rationCard || undefined,
        isVoter,
        acNumber: acNumber.trim() || undefined,
        partNumber: voterPartNumber.trim() || undefined,
        sectionNumber: voterSectionNumber.trim() || undefined,
        boothNumber: boothNumber.trim() || undefined,
        boothName: boothName.trim() || undefined,
        note: note.trim() || undefined,
        district_id: districtId || undefined,
        assembly_id: assemblyId || undefined,
        gaon_id: gaonId || undefined,
        gan_number_id: ganId || undefined,
        gat_number_id: gatId || undefined,
        prabhag_id: prabhagId || undefined,
        prabhagAreaId: prabhagAreaId || undefined,
        religion: religionId || undefined,
        cast: castId || undefined,
        subcast: subCastId || undefined,
      };

      await citizenService.updateProfile(payload);

      // Re-fetch profile to sync store with fresh populated relations
      try {
        const freshProfile = await citizenService.getProfile();
        if (freshProfile) {
          store.setProfileFromApi(freshProfile);
        }
      } catch {
        // Fallback local update
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
        store.setProfile({
          firstName,
          middleName,
          lastName,
          profileName: fullName || store.profileName,
          profileEmail: email,
          profileAddress: address,
          profilePincode: pincode,
          city,
          cityType,
          alternatePhone,
          phone3,
          phone4,
          gender,
          dob,
          age,
          bloodGroup,
          education,
          occupation,
          aadharCard,
          panCard,
          voterId,
          drivingLicence,
          rationCard,
          isVoter,
          acNumber,
          voterAccountNumber: acNumber,
          voterPartNumber,
          voterSectionNumber,
          voterSlnNumber,
          boothNumber,
          boothName,
          note,
          districtId,
          districtName,
          assemblyId,
          assemblyName,
          gaonId,
          gaonName,
          ganId,
          ganName,
          gatId,
          gatName,
          prabhagId,
          prabhagName,
          prabhagAreaId,
          prabhagAreaName,
          religionId,
          religionName,
          castId,
          castName,
          subCastId,
          subCastName,
        });
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderSectionHeader = (title: string) => (
    <View className="mt-6 mb-4 pb-2 border-b border-border">
      <Text className="text-base font-inter-bold text-primary">{title}</Text>
    </View>
  );

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background h-screen overflow-hidden"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className={containerClass}>
          
          <Header showBack title="Edit Profile" onBack={handleBack} />

          <ScrollView className="flex-1 px-6 pt-2 pb-10" showsVerticalScrollIndicator={false}>
            <View className="pb-10">

              {/* 1. Basic Details */}
              {renderSectionHeader('Basic Details')}
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">First Name</Text>
                <Input placeholder="Enter first name" value={firstName} onChangeText={setFirstName} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Middle Name</Text>
                <Input placeholder="Enter middle name" value={middleName} onChangeText={setMiddleName} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Last Name</Text>
                <Input placeholder="Enter last name" value={lastName} onChangeText={setLastName} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Email</Text>
                <Input 
                  placeholder="Enter email address" 
                  value={email} 
                  onChangeText={(text) => { setEmail(text); setErrors(prev => ({ ...prev, email: '' })); }} 
                  keyboardType="email-address" 
                  error={errors.email} 
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Alternate Phone</Text>
                <Input placeholder="Enter alternate mobile number" value={alternatePhone} onChangeText={setAlternatePhone} keyboardType="phone-pad" maxLength={10} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Phone 3</Text>
                <Input placeholder="Enter additional phone" value={phone3} onChangeText={setPhone3} keyboardType="phone-pad" maxLength={10} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Phone 4</Text>
                <Input placeholder="Enter additional phone" value={phone4} onChangeText={setPhone4} keyboardType="phone-pad" maxLength={10} />
              </View>

              {/* 2. Address & City */}
              {renderSectionHeader('Address Details')}
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Address</Text>
                <Input placeholder="Enter detailed address" value={address} onChangeText={setAddress} multiline numberOfLines={2} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">City / Village</Text>
                <Input placeholder="Enter city or village name" value={city} onChangeText={setCity} />
              </View>

              <Dropdown
                label="City / Area Type"
                value={cityType}
                options={CITY_TYPE_OPTIONS}
                placeholder="Select city type"
                onSelect={(val) => setCityType(val)}
              />

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Pincode</Text>
                <Input 
                  placeholder="Enter 6-digit pincode" 
                  value={pincode} 
                  onChangeText={(text) => { const clean = text.replace(/[^0-9]/g, ''); setPincode(clean); setErrors(prev => ({ ...prev, pincode: '' })); }} 
                  keyboardType="number-pad" 
                  maxLength={6} 
                  error={errors.pincode} 
                />
              </View>

              {/* 3. Personal Details */}
              {renderSectionHeader('Personal Details')}
              <Dropdown
                label="Gender"
                value={gender}
                options={GENDER_OPTIONS}
                placeholder="Select gender"
                onSelect={(val) => setGender(val)}
              />

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Date of Birth</Text>
                <Input placeholder="YYYY-MM-DD" value={dob} onChangeText={setDob} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Age</Text>
                <Input placeholder="Enter age" value={age} onChangeText={setAge} keyboardType="number-pad" maxLength={3} />
              </View>

              <Dropdown
                label="Blood Group"
                value={bloodGroup}
                options={BLOOD_GROUP_OPTIONS}
                placeholder="Select blood group"
                onSelect={(val) => setBloodGroup(val)}
              />

              <Dropdown
                label="Education"
                value={education}
                options={EDUCATION_OPTIONS}
                placeholder="Select education level"
                onSelect={(val) => setEducation(val)}
              />

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Occupation</Text>
                <Input placeholder="Enter occupation" value={occupation} onChangeText={setOccupation} />
              </View>

              {/* 4. Identity Documents */}
              {renderSectionHeader('Identity Documents')}
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Aadhar Card</Text>
                <Input placeholder="XXXX-XXXX-XXXX" value={aadharCard} onChangeText={setAadharCard} keyboardType="number-pad" maxLength={16} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">PAN Card</Text>
                <Input placeholder="Enter PAN number" value={panCard} onChangeText={setPanCard} autoCapitalize="characters" maxLength={10} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Voter ID</Text>
                <Input placeholder="Enter Voter ID" value={voterId} onChangeText={setVoterId} autoCapitalize="characters" />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Driving Licence</Text>
                <Input placeholder="Enter Driving Licence number" value={drivingLicence} onChangeText={setDrivingLicence} autoCapitalize="characters" />
              </View>

              <Dropdown
                label="Ration Card"
                value={rationCard}
                options={RATION_CARD_OPTIONS}
                placeholder="Select ration card type"
                onSelect={(val) => setRationCard(val)}
              />

              {/* 5. Location & Administrative Details (Dynamic) */}
              {renderSectionHeader('Location & Administrative (Dynamic)')}
              <Dropdown
                label="District (जिल्हा)"
                value={districtName}
                options={districts}
                placeholder="Select District"
                loading={loadingMaster && districts.length === 0}
                onSelect={(name, id) => {
                  setDistrictName(name);
                  setDistrictId(id ?? null);
                }}
              />

              <Dropdown
                label="Assembly / Vidhansabha (विधानसभा)"
                value={assemblyName}
                options={assemblies}
                placeholder="Select Assembly"
                loading={loadingMaster && assemblies.length === 0}
                onSelect={(name, id) => {
                  setAssemblyName(name);
                  setAssemblyId(id ?? null);
                }}
              />

              <Dropdown
                label="Gaon / Village (गाव)"
                value={gaonName}
                options={gaons}
                placeholder="Select Gaon"
                loading={loadingMaster && gaons.length === 0}
                onSelect={(name, id) => {
                  setGaonName(name);
                  setGaonId(id ?? null);
                }}
              />

              <Dropdown
                label="Gan / Panchayat Samiti (गण)"
                value={ganName}
                options={gans}
                placeholder="Select Gan"
                loading={loadingMaster && gans.length === 0}
                onSelect={(name, id) => {
                  setGanName(name);
                  setGanId(id ?? null);
                }}
              />

              <Dropdown
                label="Gat / Zilla Parishad (गट)"
                value={gatName}
                options={gats}
                placeholder="Select Gat"
                loading={loadingMaster && gats.length === 0}
                onSelect={(name, id) => {
                  setGatName(name);
                  setGatId(id ?? null);
                }}
              />

              <Dropdown
                label="Prabhag / Ward (प्रभाग)"
                value={prabhagName}
                options={prabhags}
                placeholder="Select Prabhag"
                loading={loadingMaster && prabhags.length === 0}
                onSelect={(name, id) => {
                  setPrabhagName(name);
                  setPrabhagId(id ?? null);
                }}
              />

              <Dropdown
                label="Prabhag Area (प्रभाग परिसर)"
                value={prabhagAreaName}
                options={prabhagAreas}
                placeholder="Select Prabhag Area"
                loading={loadingMaster && prabhagAreas.length === 0}
                onSelect={(name, id) => {
                  setPrabhagAreaName(name);
                  setPrabhagAreaId(id ?? null);
                }}
              />

              {/* 6. Caste & Religion (Dynamic) */}
              {renderSectionHeader('Caste & Religion (Dynamic)')}
              <Dropdown
                label="Religion (धर्म)"
                value={religionName}
                options={religions}
                placeholder="Select Religion"
                loading={loadingMaster && religions.length === 0}
                onSelect={(name, id) => {
                  setReligionName(name);
                  setReligionId(id ?? null);
                }}
              />

              <Dropdown
                label="Caste (जात)"
                value={castName}
                options={casts}
                placeholder="Select Caste"
                loading={loadingMaster && casts.length === 0}
                onSelect={(name, id) => {
                  setCastName(name);
                  setCastId(id ?? null);
                }}
              />

              <Dropdown
                label="Sub-Caste (पोटजात)"
                value={subCastName}
                options={subCasts}
                placeholder="Select Sub-Caste"
                loading={loadingMaster && subCasts.length === 0}
                onSelect={(name, id) => {
                  setSubCastName(name);
                  setSubCastId(id ?? null);
                }}
              />

              {/* 7. Voter Details */}
              {renderSectionHeader('Voter Information')}
              <View className="mb-4 flex-row items-center justify-between p-3 bg-surface border border-border rounded-xl">
                <View className="flex-1 mr-4">
                  <Text className="text-sm font-inter-semibold text-dark">Is Registered Voter</Text>
                  <Text className="text-xs font-inter text-muted">Toggle if citizen is registered in electoral roll</Text>
                </View>
                <Switch 
                  value={isVoter} 
                  onValueChange={setIsVoter} 
                  trackColor={{ false: colors.border, true: colors.primary }} 
                  thumbColor={colors.white} 
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">AC Number</Text>
                <Input placeholder="Enter AC Number" value={acNumber} onChangeText={setAcNumber} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Part Number</Text>
                <Input placeholder="Enter Part Number" value={voterPartNumber} onChangeText={setVoterPartNumber} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Section Number</Text>
                <Input placeholder="Enter Section Number" value={voterSectionNumber} onChangeText={setVoterSectionNumber} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">SLN Number In Part</Text>
                <Input placeholder="Enter SLN Number" value={voterSlnNumber} onChangeText={setVoterSlnNumber} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Booth Number</Text>
                <Input placeholder="Enter Booth Number" value={boothNumber} onChangeText={setBoothNumber} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Booth Name</Text>
                <Input placeholder="Enter Booth Name" value={boothName} onChangeText={setBoothName} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Note</Text>
                <Input placeholder="Additional notes..." value={note} onChangeText={setNote} multiline numberOfLines={3} />
              </View>

            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="px-6 py-4 bg-background border-t border-border flex-row gap-x-3">
            <View className="flex-1">
              <Button title="Cancel" onPress={() => router.back()} variant="secondary" disabled={saving} />
            </View>
            <View className="flex-1">
              <Button 
                title={saving ? "Saving..." : "Update Profile"} 
                onPress={handleSave} 
                variant="primary" 
                disabled={saving} 
              />
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
