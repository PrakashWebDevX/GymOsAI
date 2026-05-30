import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, Card, Loader } from '../../components/common';
import { useUserStore } from '../../store';
import { FITNESS_GOALS, ACTIVITY_LEVELS } from '../../constants';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { profile, fetchProfile, updateProfile, isLoading } = useUserStore();
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile().then((p) => p && setForm(p));
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile({
        fullName: form.full_name,
        bio: form.bio,
        heightCm: form.height_cm,
        weightKg: form.weight_kg,
        activityLevel: form.activity_level,
        fitnessGoal: form.fitness_goal,
        gender: form.gender,
      });
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading && !profile) return <Loader fullScreen text="Loading profile..." />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Profile</h1>
        <Button variant={editing ? 'primary' : 'outline'} onClick={editing ? handleSave : () => setEditing(true)}>
          {editing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </header>

      <div className={styles.grid}>
        <Card title="Personal Info" padding="lg">
          <div className={styles.avatar}>
            {profile?.full_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Full Name</label>
              {editing ? (
                <input value={form.full_name || ''} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              ) : (
                <span>{profile?.full_name || '—'}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Bio</label>
              {editing ? (
                <textarea value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
              ) : (
                <span>{profile?.bio || 'No bio yet'}</span>
              )}
            </div>
          </div>
        </Card>

        <Card title="Fitness Profile" padding="lg">
          <div className={styles.fields}>
            <div className={styles.field}>
              <label>Height (cm)</label>
              {editing ? (
                <input type="number" value={form.height_cm || ''} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} />
              ) : (
                <span>{profile?.height_cm ? `${profile.height_cm} cm` : '—'}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Weight (kg)</label>
              {editing ? (
                <input type="number" value={form.weight_kg || ''} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} />
              ) : (
                <span>{profile?.weight_kg ? `${profile.weight_kg} kg` : '—'}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Activity Level</label>
              {editing ? (
                <select value={form.activity_level || ''} onChange={(e) => setForm({ ...form, activity_level: e.target.value })}>
                  {ACTIVITY_LEVELS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              ) : (
                <span>{ACTIVITY_LEVELS.find((a) => a.value === profile?.activity_level)?.label || '—'}</span>
              )}
            </div>
            <div className={styles.field}>
              <label>Fitness Goal</label>
              {editing ? (
                <select value={form.fitness_goal || ''} onChange={(e) => setForm({ ...form, fitness_goal: e.target.value })}>
                  {FITNESS_GOALS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              ) : (
                <span>{FITNESS_GOALS.find((g) => g.value === profile?.fitness_goal)?.label || '—'}</span>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
