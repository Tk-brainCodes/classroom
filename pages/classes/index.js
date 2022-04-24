import ClassInviteTable from '../../components/ClassInviteTable';
import { PrismaClient } from '@prisma/client';
import Head from 'next/head';
import Navbar from '../../components/navbar';
import Link from 'next/link';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(ctx) {
  const prisma = new PrismaClient();
  const userSession = await getSession(ctx);
  if (!userSession) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
    return {};
  }
  const userInfo = await prisma.User.findMany({
    where: {
      email: userSession['user']['email']
    }
  });
  const classrooms = await prisma.Classroom.findMany({
    where: {
      classroomTeacherId: userInfo[0].id
    }
  });
  const output = [];
  for (let i = 0; i < classrooms.length; i++) {
    output[i] = {
      classroomName: classrooms[i].classroomName,
      classroomId: classrooms[i].classroomId,
      description: classrooms[i].description,
      createdAt: JSON.stringify(classrooms[i].createdAt)
    };
  }
  return {
    props: { userSession, classrooms: output }
  };
}

export default function Classes({ userSession, classrooms }) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {userSession && (
        <>
          <Navbar>
            <li>
              <div className='border-solid border-2 pl-4 pr-4'>
                <Link href={'/classes'}>Classes</Link>
              </div>
            </li>
            <li>
              <div className='border-solid border-2 pl-4 pr-4'>
                <Link href={'/'}> Menu</Link>
              </div>
            </li>
            <li>
              <div className='hover:bg-[#ffbf00] shadedow-lg border-solid border-color: inherit; border-2 pl-4 pr-4 bg-[#f1be32] text-black'>
                <Link href={'/'}>Sign out</Link>
              </div>
            </li>
          </Navbar>

          <div className={'text-center p-10'}>
            <h1> Copy invite code by clicking on your preferred class. </h1>
          </div>
          {classrooms.map(classrooms => (
            <div key={classrooms.id}>
              <a>
                <ClassInviteTable classes={classrooms}></ClassInviteTable>
              </a>
            </div>
          ))}
        </>
      )}
    </>
  );
}
