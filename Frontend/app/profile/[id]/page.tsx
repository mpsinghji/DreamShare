"use client";

import Layout from '@/components/Profile/Layout';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { toast } from 'sonner';

const ProfilePage = () => {
  const params = useParams();
  const username = params.id;

  return (
    <div>
      <Layout username={username as string} />
    </div>
  );
};

export default ProfilePage;
