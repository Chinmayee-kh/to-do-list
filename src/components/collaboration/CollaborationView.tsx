import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '../../types';

export const CollaborationView: React.FC = () => {
  const [members] = useState<UserProfile[]>([
    { id: 'u1', name: 'Sophia Miller ✨', email: 'sophia@bloomflow.app', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', role: 'Owner', isOnline: true },
    { id: 'u2', name: 'Alex Rivera', email: 'alex@bloomflow.app', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', role: 'Admin', isOnline: true },
    { id: 'u3', name: 'Emma Watson', email: 'emma@bloomflow.app', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', role: 'Member', isOnline: false },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviteSent, setIsInviteSent] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviteSent(true);
    setInviteEmail('');
    setTimeout(() => setIsInviteSent(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight flex items-center gap-2">
          <Users size={24} className="text-black dark:text-white" />
          <span>Real-Time Collaboration Studio</span>
        </h2>
        <p className="text-xs text-neutral-400 font-medium mt-0.5">
          Invite teammates, assign tasks, and track live activity together
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Members Column */}
        <div className="lg:col-span-2 p-5 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-black dark:text-white flex items-center gap-2">
              <Shield size={18} className="text-black dark:text-white" />
              <span>Workspace Members ({members.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {members.map((member) => (
              <div 
                key={member.id}
                className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name} 
                      className="w-10 h-10 rounded-full object-cover border border-black/10 dark:border-white/10"
                    />
                    {member.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-black dark:bg-white ring-2 ring-white dark:ring-black" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-black dark:text-white flex items-center gap-2">
                      {member.name}
                      <span className="px-2 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-bold">
                        {member.role}
                      </span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-medium">{member.email}</p>
                  </div>
                </div>

                <span className={`text-xs font-bold ${member.isOnline ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
                  {member.isOnline ? 'Online Now' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Member Card */}
        <div className="p-5 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-black dark:text-white flex items-center gap-2">
              <UserPlus size={18} className="text-black dark:text-white" />
              <span>Invite Teammate</span>
            </h3>
            <p className="text-xs text-neutral-400 font-medium mt-1">
              Send an instant invitation link to join your private workspace.
            </p>

            <form onSubmit={handleSendInvite} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  required
                  className="w-full px-4 py-2.5 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg text-xs font-semibold focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="gradient-pink-btn w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                <span>Send Invite Link</span>
              </button>

              {isInviteSent && (
                <div className="p-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Invitation sent!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
