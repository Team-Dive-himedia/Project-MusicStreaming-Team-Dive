package com.himedia.projectteamdive.dto;

import com.himedia.projectteamdive.entity.Cart;
import lombok.Getter;

@Getter
public class CartResponseDto {
    private int cartId;
    private int musicId;
    private String title;
    private String artist;

    public CartResponseDto(Cart cart) {
        this.cartId = cart.getCartId();
        this.musicId = cart.getMusic().getMusicId();
        this.title = cart.getMusic().getTitle();
        this.artist = cart.getMusic().getArtist().getArtistName();
    }
}
