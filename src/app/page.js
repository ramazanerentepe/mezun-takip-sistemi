import { redirect } from 'next/navigation';

export default function Home() {
  // Ana sayfaya gelen herkesi giriş ekranına yönlendir
  redirect('/login');
}