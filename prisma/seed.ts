import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create or update default Admin User
  const hashedAdminPassword = await bcrypt.hash('Odinbi@123#', 10);
  const user = await prisma.user.upsert({
    where: { email: 'duyrnt09@gmail.com' },
    update: {
      role: 'ADMIN',
    },
    create: {
      email: 'duyrnt09@gmail.com',
      name: 'Duy Nguyễn (Admin)',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`👤 Default Admin created/verified: ${user.email} (Role: ${user.role})`);

  // 2. Define 5 Workout Days with Exercises
  const workoutDaysData = [
    {
      dayOfWeek: 1, // Thứ 2
      name: 'Thân Trên A (Upper A)',
      focus: 'Ngực Ngang, Lưng Xô, Lưng Dày & Tay Sau',
      dayType: 'TRAINING',
      durationMin: 45,
      exercises: [
        {
          orderIndex: 1,
          nameVi: 'Đẩy Ngực Ngang Tạ Đơn',
          nameEn: 'Flat DB Press',
          equipment: 'Ghế bằng + Cặp tạ đơn',
          sets: 3,
          repsMin: 8,
          repsMax: 10,
          rir: 'RIR 2',
          techniqueNote: 'Cùi chỏ mở góc 45°–60° so với thân. Khóa chặt 2 bả vai ép vào ghế trước khi hạ tạ.',
          videoUrl: 'https://www.youtube.com/results?search_query=flat+dumbbell+press+form',
        },
        {
          orderIndex: 2,
          nameVi: 'Kéo Cáp Lưng Xô',
          nameEn: 'Wide-Grip Lat Pulldown',
          equipment: 'Giàn cáp (Thanh dài)',
          sets: 3,
          repsMin: 8,
          repsMax: 12,
          rir: 'RIR 1-2',
          techniqueNote: 'Hạ và khép hai xương bả vai (Scapular depression) trước khi kéo.',
          videoUrl: 'https://www.youtube.com/results?search_query=lat+pulldown+form',
        },
        {
          orderIndex: 3,
          nameVi: 'Ngồi Kéo Cáp Chèo Thuyền',
          nameEn: 'Seated Cable Row',
          equipment: 'Giàn cáp + Tay V-Bar',
          sets: 3,
          repsMin: 8,
          repsMax: 12,
          rir: 'RIR 1-2',
          techniqueNote: 'Kéo thanh về rốn, ép chặt 2 bả vai sau lưng. Giữ lưng thẳng.',
          videoUrl: 'https://www.youtube.com/results?search_query=seated+cable+row+form',
        },
        {
          orderIndex: 4,
          nameVi: 'Kéo Cáp Duỗi Tay Sau',
          nameEn: 'Tricep Rope Pushdown',
          equipment: 'Giàn cáp cao + Dây thừng',
          sets: 3,
          repsMin: 10,
          repsMax: 15,
          rir: 'RIR 1',
          techniqueNote: 'Cố định cùi chỏ hai bên sườn, tách 2 đầu thừng ở điểm thấp nhất để siết cơ.',
          videoUrl: 'https://www.youtube.com/results?search_query=cable+tricep+pushdown+form',
        },
        {
          orderIndex: 5,
          nameVi: 'Cuốn Tạ Đơn Tư Thế Búa',
          nameEn: 'Dumbbell Hammer Curl',
          equipment: 'Cặp tạ đơn',
          sets: 2,
          repsMin: 10,
          repsMax: 12,
          rir: 'RIR 1',
          techniqueNote: 'Hai lòng bàn tay hướng vào nhau, tăng độ dày cánh tay và sức mạnh cẳng tay.',
          videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+hammer+curl+form',
        },
      ],
    },
    {
      dayOfWeek: 2, // Thứ 3
      name: 'Thân Dưới A (Lower A)',
      focus: 'Đùi Trước, Bắp Chuối & Cơ Lõi',
      dayType: 'TRAINING',
      durationMin: 45,
      exercises: [
        {
          orderIndex: 1,
          nameVi: 'Goblet Squat (Ngồi Xổm Ôm Tạ)',
          nameEn: 'Dumbbell Goblet Squat',
          equipment: '1 quả tạ đơn vừa (8–12kg)',
          sets: 3,
          repsMin: 10,
          repsMax: 12,
          rir: 'RIR 2',
          techniqueNote: 'Ôm tạ phía trước giúp lưng luôn giữ được vị trí thẳng đứng tự nhiên, dễ duy trì form.',
          videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+goblet+squat+form',
        },
        {
          orderIndex: 2,
          nameVi: 'Bước Chùng Chân Tạ Đơn',
          nameEn: 'Walking Lunge',
          equipment: 'Cặp tạ đơn (4–8kg)',
          sets: 3,
          repsMin: 10,
          repsMax: 10,
          rir: 'RIR 1-2',
          techniqueNote: 'Bước chân vừa tầm, hạ gối sau vuông góc chạm nhẹ sàn, giữ thân người thăng bằng.',
          videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+walking+lunge+form',
        },
        {
          orderIndex: 3,
          nameVi: 'Cuốn Đùi Sau',
          nameEn: 'Leg Curl',
          equipment: 'Ghế đệm + Cáp chân / Tạ đơn',
          sets: 3,
          repsMin: 10,
          repsMax: 15,
          rir: 'RIR 1',
          techniqueNote: 'Cô lập cơ gân kheo (Hamstrings), nhịp hạ tạ chậm rãi 2 giây.',
          videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+lying+leg+curl+form',
        },
        {
          orderIndex: 4,
          nameVi: 'Nhón Bắp Chuối Đứng',
          nameEn: 'Standing Calf Raise',
          equipment: 'Bậc thềm / Tạ đơn',
          sets: 3,
          repsMin: 12,
          repsMax: 20,
          rir: 'RIR 0-1',
          techniqueNote: 'Nhón gót cao tối đa, dừng giữ 1 giây tại điểm cao nhất trước khi hạ sâu.',
          videoUrl: 'https://www.youtube.com/results?search_query=standing+dumbbell+calf+raise+form',
        },
        {
          orderIndex: 5,
          nameVi: 'Nâng Gối Treo Người',
          nameEn: 'Hanging Knee Raise',
          equipment: 'Khung OneTwoFit treo tường',
          sets: 3,
          repsMin: 10,
          repsMax: 15,
          rir: 'RIR 1-2',
          techniqueNote: 'Treo người thả lỏng vai, siết cuộn cơ bụng dưới đưa đầu gối về ngực, hạn chế đung đưa.',
          videoUrl: 'https://www.youtube.com/results?search_query=hanging+knee+raise+form',
        },
      ],
    },
    {
      dayOfWeek: 3, // Thứ 4
      name: 'Active Recovery & Mobility (Phục Hồi Tích Cực)',
      focus: 'Nghỉ sạc CNS, đi bộ dốc trên máy chạy bộ, giãn cơ linh hoạt',
      dayType: 'RECOVERY',
      durationMin: 35,
      exercises: [
        {
          orderIndex: 1,
          nameVi: 'Đi bộ dốc trên máy chạy bộ (Incline Treadmill)',
          nameEn: 'Incline Treadmill Walking',
          equipment: 'Máy chạy bộ công ty (Incline 5-8%, Speed 4.2-4.8 km/h)',
          sets: 1,
          repsMin: 15,
          repsMax: 20,
          rir: 'Zone 2',
          techniqueNote: '15–20 phút đi bộ dốc trên máy chạy bộ. Tim đập nhẹ vùng Zone 2, bơm máu phục hồi cơ bắp và cực kỳ êm ái cho khớp.',
          videoUrl: 'https://www.youtube.com/results?search_query=incline+treadmill+walking+recovery',
        },
        {
          orderIndex: 2,
          nameVi: 'Giãn cơ linh hoạt toàn thân (Mobility)',
          nameEn: 'Full Body Mobility & Stretching',
          equipment: 'Thảm sàn',
          sets: 1,
          repsMin: 10,
          repsMax: 15,
          rir: 'Thư giãn',
          techniqueNote: 'Giãn háng chiến binh (World\'s Greatest Stretch), Luồn kim giãn lưng trên, Rắn hổ mang mở ngực giải tỏa áp lực ngồi ghế.',
          videoUrl: 'https://www.youtube.com/results?search_query=full+body+mobility+routine',
        },
        {
          orderIndex: 3,
          nameVi: 'Treo thả lỏng người kéo giãn cột sống (Dead Hang)',
          nameEn: 'Dead Hang Spine Decompression',
          equipment: 'Khung treo xà OneTwoFit',
          sets: 2,
          repsMin: 20,
          repsMax: 30,
          rir: 'Thư giãn',
          techniqueNote: '2 hiệp x 20–30s. Thả lỏng toàn bộ thân dưới để trọng lực kéo giãn tự nhiên các khoang đốt sống thắt lưng.',
          videoUrl: 'https://www.youtube.com/results?search_query=dead+hang+spine+decompression',
        },
      ],
    },
    {
      dayOfWeek: 4, // Thứ 5
      name: 'Thân Trên B (Upper B)',
      focus: 'Ngực Trên, Lưng, Vai & Tay',
      dayType: 'TRAINING',
      durationMin: 45,
      exercises: [
        {
          orderIndex: 1,
          nameVi: 'Đẩy Ngực Dốc Lên Tạ Đơn',
          nameEn: 'Incline DB Press',
          equipment: 'Ghế dốc 30° + Tạ đơn',
          sets: 3,
          repsMin: 8,
          repsMax: 10,
          rir: 'RIR 2',
          techniqueNote: 'Ghế chỉnh dốc khoảng 30 độ để tập trung vào ngực trên.',
          videoUrl: 'https://www.youtube.com/results?search_query=incline+dumbbell+press+form',
        },
        {
          orderIndex: 2,
          nameVi: 'Ngồi Kéo Cáp Chèo Thuyền',
          nameEn: 'Seated Cable Row',
          equipment: 'Giàn cáp hạ thấp + Tay V-Bar',
          sets: 3,
          repsMin: 10,
          repsMax: 12,
          rir: 'RIR 1-2',
          techniqueNote: 'Duy trì chuyển động nhịp nhàng, siết chặt hai bả vai về phía sau.',
          videoUrl: 'https://www.youtube.com/results?search_query=seated+cable+row+form',
        },
        {
          orderIndex: 3,
          nameVi: 'Dang Tạ Đơn Sang Ngang',
          nameEn: 'Dumbbell Lateral Raise',
          equipment: 'Tạ đơn nhẹ',
          sets: 4,
          repsMin: 12,
          repsMax: 20,
          rir: 'RIR 1',
          techniqueNote: 'Tập trung vào vai giữa, cùi chỏ hơi cong, không giật cổ.',
          videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+lateral+raise+form',
        },
        {
          orderIndex: 4,
          nameVi: 'Kéo Cáp Ngang Trán',
          nameEn: 'Face Pull',
          equipment: 'Giàn cáp + Dây thừng',
          sets: 3,
          repsMin: 12,
          repsMax: 20,
          rir: 'RIR 1',
          techniqueNote: 'Tập trung vào vai sau và cơ trám (rhomboids), khắc phục tư thế vai gù.',
          videoUrl: 'https://www.youtube.com/results?search_query=cable+face+pull+form',
        },
        {
          orderIndex: 5,
          nameVi: 'Cuốn Tạ Đòn Ngắn',
          nameEn: 'EZ / Barbell Curl',
          equipment: 'Thanh đòn ngắn',
          sets: 2,
          repsMin: 10,
          repsMax: 12,
          rir: 'RIR 1',
          techniqueNote: 'Cố định cùi chỏ sát sườn, cuốn tạ tập trung siết cơ bắp tay trước.',
          videoUrl: 'https://www.youtube.com/results?search_query=ez+barbell+curl+form',
        },
        {
          orderIndex: 6,
          nameVi: 'Duỗi Tay Sau Qua Đầu Với Cáp',
          nameEn: 'Overhead Tricep Extension',
          equipment: 'Cáp hoặc Tạ đơn',
          sets: 2,
          repsMin: 10,
          repsMax: 15,
          rir: 'RIR 1',
          techniqueNote: 'Kéo giãn và tác động vào đầu dài (long head) của cơ tam đầu.',
          videoUrl: 'https://www.youtube.com/results?search_query=cable+overhead+tricep+extension+form',
        },
      ],
    },
    {
      dayOfWeek: 5, // Thứ 6
      name: 'Thân Dưới B (Lower B)',
      focus: 'Chuỗi Cơ Mặt Sau & Sức Mạnh',
      dayType: 'TRAINING',
      durationMin: 45,
      exercises: [
        {
          orderIndex: 1,
          nameVi: 'Dumbbell Romanian Deadlift (Bản Lề Hông RDL)',
          nameEn: 'Dumbbell Romanian Deadlift',
          equipment: 'Cặp tạ đơn vừa',
          sets: 3,
          repsMin: 8,
          repsMax: 12,
          rir: 'RIR 2',
          techniqueNote: 'Đẩy mông ra sau, lướt tạ sát ống chân, lưng thẳng tắp. Quản lý form chuẩn.',
          videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+form',
        },
        {
          orderIndex: 2,
          nameVi: 'Bulgarian Split Squat (Gác Chân Lên Ghế)',
          nameEn: 'Bulgarian Split Squat',
          equipment: 'Ghế bằng + Cặp tạ đơn',
          sets: 3,
          repsMin: 8,
          repsMax: 10,
          rir: 'RIR 1-2',
          techniqueNote: 'Phát triển sức mạnh đơn tuyến từng chân, kích thích đều đùi và mông.',
          videoUrl: 'https://www.youtube.com/results?search_query=bulgarian+split+squat+form',
        },
        {
          orderIndex: 3,
          nameVi: 'Gánh Tạ Đòn Trong Khung (Barbell Squat)',
          nameEn: 'Barbell Back Squat',
          equipment: 'Khung Power Rack',
          sets: 3,
          repsMin: 6,
          repsMax: 10,
          rir: 'RIR 2',
          techniqueNote: 'Giữ RIR = 2 để đảm bảo an toàn sau khi đã tập qua RDL và Bulgarian. Nén bụng vững chắc.',
          videoUrl: 'https://www.youtube.com/results?search_query=barbell+back+squat+form',
        },
        {
          orderIndex: 4,
          nameVi: 'Plank Gồng Bụng Tĩnh',
          nameEn: 'RKC Plank',
          equipment: 'Thảm sàn',
          sets: 3,
          repsMin: 20,
          repsMax: 40,
          rir: 'RIR 1',
          techniqueNote: 'Siết mông, khóa bụng, cùi chỏ kéo ghì về phía mũi chân để tăng áp lực ổ bụng.',
          videoUrl: 'https://www.youtube.com/results?search_query=rkc+plank+form',
        },
      ],
    },
  ];

  // 3. Insert or update WorkoutDays and Exercises
  for (const dayData of workoutDaysData) {
    const { exercises, ...dayInfo } = dayData;
    
    // Find existing or create
    let day = await prisma.workoutDay.findFirst({
      where: { dayOfWeek: dayInfo.dayOfWeek },
    });

    if (!day) {
      day = await prisma.workoutDay.create({
        data: dayInfo,
      });
      console.log(`📅 Created Workout Day ${day.dayOfWeek}: ${day.name}`);
    } else {
      day = await prisma.workoutDay.update({
        where: { id: day.id },
        data: dayInfo,
      });
      console.log(`📅 Updated Workout Day ${day.dayOfWeek}: ${day.name}`);
    }

    // Upsert exercises
    for (const exData of exercises) {
      const existingEx = await prisma.exercise.findFirst({
        where: {
          workoutDayId: day.id,
          orderIndex: exData.orderIndex,
        },
      });

      if (!existingEx) {
        await prisma.exercise.create({
          data: {
            ...exData,
            workoutDayId: day.id,
          },
        });
      } else {
        await prisma.exercise.update({
          where: { id: existingEx.id },
          data: exData,
        });
      }
    }
  }

  // 4. Seeding completed without demo sessions (clean start for real user workouts)
  console.log('🎉 Seeding completed successfully (Clean workout history)!');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
