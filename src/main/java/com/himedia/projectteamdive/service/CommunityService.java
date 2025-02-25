package com.himedia.projectteamdive.service;

import com.himedia.projectteamdive.entity.*;
import com.himedia.projectteamdive.repository.AllpageRepository;
import com.himedia.projectteamdive.repository.LikesRepository;
import com.himedia.projectteamdive.repository.MemberRepository;
import com.himedia.projectteamdive.repository.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CommunityService {
    @Autowired
    LikesRepository lr;
    @Autowired
    ReplyRepository rr;
    @Autowired
    AllpageRepository apr;

    @Autowired
    MemberRepository mr;
    public void insertReply(Reply reply, String type, int entityId,String memberId) {
        Pagetype pagetype= Pagetype.valueOf(type);
        Allpage allpage=apr.findByEntityIdAndPagetype(entityId,pagetype);
        reply.setAllpage(allpage);
        reply.setMember(mr.findByMemberId(memberId));
        rr.save(reply);
    }

    public void deleteReply(int replyId) {
        Reply reply=rr.findByReplyId(replyId);
        rr.delete(reply);
    }

    public void insertLikes(String memberId, String type, int entityId) {
        Pagetype pagetype= Pagetype.valueOf(type);
        Allpage allpage=apr.findByEntityIdAndPagetype(entityId,pagetype);
        Member member=mr.findByMemberId(memberId);
        Likes likes=lr.findByMemberAndAllpage(member,allpage);
        if(likes==null){
            likes=new Likes(member,allpage);
            lr.save(likes);
        }else{
            lr.delete(likes);
        }
    }

    public List<Reply> getReply(String type, int entityId) {
        Pagetype pagetype= Pagetype.valueOf(type);
        Allpage allpage=apr.findByEntityIdAndPagetype(entityId,pagetype);
        List<Reply>replyList=rr.findByAllpage(allpage);
        return replyList;
    }

    public List<Likes> getLikes(String type, String memberId) {
        Pagetype pagetype = Pagetype.valueOf(type.toUpperCase());
        return lr.findByMemberIdAndPagetype(memberId, pagetype);
    }

    public List<Reply> getReplyList(String type, String memberId) {
        Pagetype pagetype = Pagetype.valueOf(type.toUpperCase());
        return rr.findByMemberIdAndPagetype(memberId, pagetype);
    }
}
