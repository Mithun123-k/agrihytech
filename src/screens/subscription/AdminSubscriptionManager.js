import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from '../../components/common/AppText';
import {
  deleteAdminPlanAPI,
  getAdminPlansAPI,
  saveAdminPlanAPI,
} from '../../features/subscription/subscriptionAPI';

const emptyDraft = {
  name: '',
  type: 'MONTHLY',
  applicableRole: 'B2B',
  price: '0',
  duration: '30',
  trialDays: '0',
  featuresText: '',
  isActive: true,
  isRecommended: false,
};

const errorMessage = error =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  'Something went wrong';

export default function AdminSubscriptionManager({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const [plans, setPlans] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState(emptyDraft);

  const load = useCallback(async () => {
    if (user?.role !== 'ADMIN') return;
    setLoading(true);
    try {
      const response = await getAdminPlansAPI();
      setPlans(Array.isArray(response.data) ? response.data : response.data?.plans || []);
    } catch (error) {
      Alert.alert('Unable to load plans', errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (user?.role !== 'ADMIN') return null;

  const openCreate = () => {
    setEditingId('');
    setDraft(emptyDraft);
    setModalVisible(true);
  };

  const openEdit = plan => {
    setEditingId(plan._id);
    setDraft({
      name: plan.name || '',
      type: plan.type || 'MONTHLY',
      applicableRole: plan.applicableRole || 'B2B',
      price: String(plan.price ?? 0),
      duration: String(plan.duration ?? 30),
      trialDays: String(plan.trialDays ?? 0),
      featuresText: (plan.features || []).join(', '),
      isActive: plan.isActive !== false,
      isRecommended: Boolean(plan.isRecommended),
    });
    setModalVisible(true);
  };

  const save = async () => {
    const price = Number(draft.price);
    const duration = Number(draft.duration);
    const trialDays = Number(draft.trialDays);
    if (!draft.name.trim() || price < 0 || duration <= 0 || trialDays < 0) {
      Alert.alert('Missing details', 'Enter a plan name and valid price and duration.');
      return;
    }
    setSaving(true);
    try {
      await saveAdminPlanAPI({
        name: draft.name.trim(),
        type: draft.type,
        applicableRole: draft.applicableRole,
        price,
        currency: 'INR',
        duration,
        trialDays,
        features: draft.featuresText.split(',').map(value => value.trim()).filter(Boolean),
        isActive: draft.isActive,
        isRecommended: draft.isRecommended,
      }, editingId);
      setModalVisible(false);
      await load();
    } catch (error) {
      Alert.alert('Unable to save plan', errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const remove = plan => Alert.alert(
    'Delete plan?',
    `${plan.name} will be permanently removed.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try { await deleteAdminPlanAPI(plan._id); await load(); }
          catch (error) { Alert.alert('Unable to delete plan', errorMessage(error)); }
        },
      },
    ],
  );

  const visiblePlans = plans.filter(plan => filter === 'ALL' || plan.applicableRole === filter);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={23} color="#202820" />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Manage Subscriptions</AppText>
        <TouchableOpacity onPress={openCreate} style={styles.addButton}>
          <Icon name="add" size={23} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {[
          ['ALL', 'All'],
          ['B2B', 'Seller / B2B'],
          ['COMPANY', 'Company'],
        ].map(([value, label]) => (
          <TouchableOpacity key={value} onPress={() => setFilter(value)} style={[styles.filter, filter === value && styles.filterActive]}>
            <AppText style={[styles.filterText, filter === value && styles.filterTextActive]}>{label}</AppText>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <ActivityIndicator style={styles.loader} size="large" color="#4C7A1E" /> : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {visiblePlans.map(plan => (
            <View key={plan._id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardInfo}>
                  <View style={styles.badges}>
                    <AppText style={styles.roleBadge}>{plan.applicableRole === 'COMPANY' ? 'Company' : plan.applicableRole === 'B2B' ? 'Seller / B2B' : 'Role required'}</AppText>
                    <AppText style={[styles.statusBadge, plan.isActive === false && styles.inactiveBadge]}>{plan.isActive === false ? 'Inactive' : 'Active'}</AppText>
                  </View>
                  <AppText style={styles.planName}>{plan.name}</AppText>
                  <AppText style={styles.price}>{Number(plan.price) === 0 ? 'Free' : `₹${Number(plan.price).toLocaleString('en-IN')}`} · {plan.duration} days</AppText>
                  <AppText style={styles.type}>{plan.type}{plan.isRecommended ? ' · Recommended' : ''}</AppText>
                </View>
                <TouchableOpacity onPress={() => openEdit(plan)} style={styles.editButton}><Icon name="create-outline" size={20} color="#4C7A1E" /></TouchableOpacity>
              </View>
              {plan.features?.length ? <AppText style={styles.features}>{plan.features.join(' • ')}</AppText> : null}
              <TouchableOpacity onPress={() => remove(plan)} style={styles.deleteButton}><Icon name="trash-outline" size={17} color="#C73D3D" /><AppText style={styles.deleteText}>Delete</AppText></TouchableOpacity>
            </View>
          ))}
          {!visiblePlans.length ? <View style={styles.empty}><Icon name="card-outline" size={42} color="#A8B0A5" /><AppText style={styles.emptyText}>No subscription plans found.</AppText></View> : null}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}><AppText style={styles.modalTitle}>{editingId ? 'Edit Plan' : 'Add Plan'}</AppText><TouchableOpacity onPress={() => setModalVisible(false)}><Icon name="close" size={25} color="#333" /></TouchableOpacity></View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Label text="Plan name" /><TextInput value={draft.name} onChangeText={value => setDraft(old => ({ ...old, name: value }))} style={styles.input} placeholder="Monthly plan" placeholderTextColor="#999" />
              <Label text="Available for" />
              <View style={styles.choiceRow}>{[['B2B', 'Seller / B2B'], ['COMPANY', 'Company']].map(([value, label]) => <Choice key={value} label={label} active={draft.applicableRole === value} onPress={() => setDraft(old => ({ ...old, applicableRole: value }))} />)}</View>
              <Label text="Plan type" />
              <View style={styles.choiceRow}>{['MONTHLY', 'YEARLY'].map(value => <Choice key={value} label={value} active={draft.type === value} onPress={() => setDraft(old => ({ ...old, type: value }))} />)}</View>
              <View style={styles.twoColumns}><View style={styles.column}><Label text="Price (₹)" /><TextInput value={draft.price} onChangeText={value => setDraft(old => ({ ...old, price: value.replace(/[^0-9.]/g, '') }))} style={styles.input} keyboardType="decimal-pad" /></View><View style={styles.column}><Label text="Duration (days)" /><TextInput value={draft.duration} onChangeText={value => setDraft(old => ({ ...old, duration: value.replace(/\D/g, '') }))} style={styles.input} keyboardType="number-pad" /></View></View>
              <Label text="Trial days" /><TextInput value={draft.trialDays} onChangeText={value => setDraft(old => ({ ...old, trialDays: value.replace(/\D/g, '') }))} style={styles.input} keyboardType="number-pad" />
              <Label text="Features (comma separated)" /><TextInput value={draft.featuresText} onChangeText={value => setDraft(old => ({ ...old, featuresText: value }))} style={[styles.input, styles.multiline]} multiline />
              <Toggle label="Active" value={draft.isActive} onValueChange={value => setDraft(old => ({ ...old, isActive: value }))} />
              <Toggle label="Recommended" value={draft.isRecommended} onValueChange={value => setDraft(old => ({ ...old, isRecommended: value }))} />
              <TouchableOpacity disabled={saving} onPress={save} style={[styles.saveButton, saving && styles.disabled]}><AppText style={styles.saveText}>{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Plan'}</AppText></TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const Label = ({ text }) => <AppText style={styles.label}>{text}</AppText>;
const Choice = ({ label, active, onPress }) => <TouchableOpacity onPress={onPress} style={[styles.choice, active && styles.choiceActive]}><AppText style={[styles.choiceText, active && styles.choiceTextActive]}>{label}</AppText></TouchableOpacity>;
const Toggle = ({ label, value, onValueChange }) => <View style={styles.toggleRow}><AppText style={styles.toggleLabel}>{label}</AppText><Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#D7DBD4', true: '#A8C98D' }} thumbColor={value ? '#4C7A1E' : '#fff'} /></View>;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F1F5ED' },
  header: { paddingTop: 48, paddingHorizontal: 18, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff' },
  headerTitle: { fontSize: 19, fontWeight: '700', color: '#202820' },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  addButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#4C7A1E', alignItems: 'center', justifyContent: 'center' },
  filters: { flexDirection: 'row', padding: 14, gap: 8 },
  filter: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', borderWidth: 1, borderColor: '#DDE4D8' },
  filterActive: { backgroundColor: '#4C7A1E', borderColor: '#4C7A1E' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#555' },
  filterTextActive: { color: '#fff' },
  loader: { marginTop: 80 },
  content: { paddingHorizontal: 14 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E0E6DC' },
  cardTop: { flexDirection: 'row' }, cardInfo: { flex: 1 }, badges: { flexDirection: 'row', gap: 7, marginBottom: 9 },
  roleBadge: { fontSize: 11, fontWeight: '700', color: '#4C7A1E', backgroundColor: '#EAF3E2', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  statusBadge: { fontSize: 11, fontWeight: '700', color: '#278044', backgroundColor: '#E4F5E8', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  inactiveBadge: { color: '#777', backgroundColor: '#ECEEEB' }, planName: { fontSize: 18, fontWeight: '700', color: '#202820' },
  price: { fontSize: 15, fontWeight: '600', color: '#333', marginTop: 5 }, type: { fontSize: 12, color: '#777', marginTop: 4 },
  editButton: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#EEF5E8', alignItems: 'center', justifyContent: 'center' },
  features: { fontSize: 12, color: '#666', lineHeight: 18, marginTop: 12 }, deleteButton: { flexDirection: 'row', gap: 6, alignItems: 'center', alignSelf: 'flex-end', marginTop: 13 }, deleteText: { color: '#C73D3D', fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 70 }, emptyText: { marginTop: 12, color: '#777' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }, modalCard: { maxHeight: '90%', backgroundColor: '#F8FAF6', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, modalTitle: { fontSize: 21, fontWeight: '700', color: '#202820' },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginTop: 13, marginBottom: 7 }, input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D9DFD5', borderRadius: 12, paddingHorizontal: 13, minHeight: 48, color: '#222', fontSize: 14 }, multiline: { minHeight: 85, textAlignVertical: 'top', paddingTop: 12 },
  choiceRow: { flexDirection: 'row', gap: 9 }, choice: { flex: 1, minHeight: 45, borderRadius: 12, borderWidth: 1, borderColor: '#D9DFD5', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }, choiceActive: { borderColor: '#4C7A1E', backgroundColor: '#EAF3E2' }, choiceText: { color: '#666', fontWeight: '600', fontSize: 13 }, choiceTextActive: { color: '#3F6F20' },
  twoColumns: { flexDirection: 'row', gap: 10 }, column: { flex: 1 }, toggleRow: { marginTop: 13, minHeight: 50, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#D9DFD5', paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, toggleLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  saveButton: { marginTop: 20, marginBottom: 16, minHeight: 52, borderRadius: 14, backgroundColor: '#4C7A1E', alignItems: 'center', justifyContent: 'center' }, disabled: { opacity: 0.55 }, saveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
