package com.backend.java_backend.Utils;
import com.backend.java_backend.Classes.User;
import com.backend.java_backend.Repos.UserRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserRepo userRepo;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // List of paths that should be publicly accessible
    private final List<String> PUBLIC_PATHS = Collections.singletonList("/api/auth/**");

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Check if the current path should be excluded from filtering
        String path = request.getServletPath();
        return PUBLIC_PATHS.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7); // Remove "Bearer "
        if (!jwtUtils.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtUtils.getUsernameFromToken(token);
        Claims claims = jwtUtils.getAllClaimsFromToken(token);
        String role = claims.get("role", String.class);

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Set authentication context
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                user, null, Collections.singletonList(authority)
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
