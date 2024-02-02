import express from "express";
import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookies from "cookie-parser";
import tokenmiddle from "../middleware/middlewares.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { email, password, name } = req.body;
  const registerdata = await prisma.users.findFirst({
    where: { email },
  });

  if (registerdata) {
    return res.status(404).json({ Message: "데이터 존재" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ Message: "6자 이상 20자 이하 비밀번호를 설정해주세요" });
  }

  const hashedpassword = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      email,
      password: hashedpassword,
      name,
    },
  });

  return res.status(201).json({ data: user });
});

// const tokenstorage = {};

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.users.findFirst({ where: { email } });
  // const ACCESS_TOKEN_SECRET_KEY = user.userId;

  // const accesstoken = jwt.sign({id : id}, ACCESS_TOKEN_SECRET_KEY, {expiresIn : '10s'});

  // tokenstorage[refreshtoken] = {
  //   userId : userId,
  //   ip : req.ip,
  //   userAgent : req.header['user-agent'],
  //  }

  //  res.cookie('accestoken', accesstoken);

  if (!user) {
    return res.status(401).json({ Message: "존재하지 않은 이메일" });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ Message: "비밀번호 불일치" });
  }

  const token = jwt.sign({ userId: user.userId }, "secret-key", {
    expiresIn: "12h",
  }); //////// 다시 하기!

  res.cookie("acess_token", `Bearer ${token}`);
  return res.status(200).json({ Message: "로그인 완료" });
});

router.post("/resume", tokenmiddle, async (req, res, next) => {
  try {
    const { userId, name, email, password } = req.user;
    const { resumetitle, resumecontent, resumestatus } = req.body;
    const resumedata = await prisma.resume.findFirst({
      where: { userId: parseInt(userId) },
    });

    if (resumedata) {
      return res.status(404).json({ Message: "이력서 데이터가 이미 존재" });
    }

    await prisma.users.findUnique({
      where: {
        userId: parseInt(userId),
        email,
        name,
        password,
      },
    });

    const resumes = await prisma.resume.create({
      data: {
        resumetitle,
        resumecontent,
        resumestatus: "APPLY",
        user: {
          connect: {
            userId: userId,
          },
        },
      },
    });

    return res.status(201).json({ data: resumes });
  } catch (error) {
    console.log(error.name);
  }
});
// const user = await prisma.users.findUnique({
//   where: {
//     userId: parseInt(userId),
//     email,
//     name,
//   },
// });

// const resumes = await prisma.resume.create({
//   data: {
//     resumeId,
//     resumetitle,
//     resumecontent,
//     user: {
//       select:{
//         userId : user.userId,
//         email,
//         password,
//         name: user.name,
//       }
//     }
//   },
// });

router.put("/resume/:resumeId", tokenmiddle, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { resumeId } = req.params;
    const { resumetitle, resumecontent, resumestatus } = req.body;

    const resumeput = await prisma.resume.findUnique({
      where: {
        resumeId: parseInt(resumeId),
      },
    });
    
    if (!resumeput) {
      return res.status(404).json({ Message: "해당 목록이 존재하지 않음" });
    }


    // resumeput.resumetitle = resumetitle;
    // resumeput.resumecontent = resumecontent;
    // resumeput.resumestatus = resumestatus;


    
    const resumedata = await prisma.resume.update({
      where:{
        resumetitle,
        resumecontent,
        resumestatus
      }                     ///////////////// 수정 필요
    });

    return res.status(200).json({resumedata});
  } catch (error) {
    console.log(error.name);
  }
});

router.delete("/resume/:resumeId", tokenmiddle, async (req, res, next) => {
  const { resumeId } = req.params;

  const resumedelete = await prisma.resume.findUnique({
    where: {
      resumeId: parseInt(resumeId),
    },
  });
  if (!resumedelete) {
    return res.status(404).json({ Message: "해당 목록이 존재하지 않음" });
  }

  await prisma.resume.delete({
    where: { resumeId: parseInt(resumeId) },
  });

  return res.status(200).json({ Message: "삭제 완료" });
});

//// 이력서 불러옴

router.get("/resumeacess", tokenmiddle, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: parseInt(userId) },
    select: {
      userId: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      resume: {
        select: {
          resumeId: true,
          resumetitle: true,
          resumecontent: true,
          resumestatus: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(401).json({ Message: "존재하지 않는 명세서입니다." });
  }

  return res.status(201).json({ data: user });
});

router.get("/resumeacess/:resumeId", tokenmiddle, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { resumeId } = req.params;

    const data = await prisma.resume.findMany({
      where: { resumeId: parseInt(resumeId) },
    });

    if (!data) {
      return res.status(401).json({ Mssage: "해당 목록이 존재하지 않습니다." });
    }

    // const user = await prisma.resume.findFirst({
    //   where: { resumeId: parseInt(resumeId) },
    //   select: {
    //     resumeId: true,
    //     resumetitle: true,
    //     resumecontent: true,
    //     resumestatus: true,
    //     users: {
    //       select: {
    //         userId: true,
    //         email: true,
    //         password: true,
    //         name: true,
    //       },
    //     },
    //   },
    // });

    return res.status(201).json({ data });
  } catch (error) {
    console.log(error.name);
  }
});

// router.post("/resume", async (req, res, next) => {
//   const {userId, name} = req.params;
//   const {resumetitle, resumecontent, resumestatus, createdAt} = req.body;
//   const listdata = await prisma.users.findFirst({
//     where: { userId },
//   });

//   if (listdata) {
//     return res.status(404).json({ Message: "이력서 데이터 존재" });
//   }

//   const user = await prisma.resume.create({
//     data: {
//       userId : user.userId,
//       name,
//       resumetitle,
//       resumecontent,
//       resumestatus : "APPLY",
//       createdAt,
//       updatedAt
//     },
//   });

//   return res.status(201).json({ data: userInfo });
// });

export default router;
