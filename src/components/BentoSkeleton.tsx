import React from 'react';

export function SkeletonBox({
  width = '100%',
  height = '20px',
  borderRadius,
  className = '',
  style = {},
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function CardLargeSkeleton() {
  return (
    <div className="card-large glass bento-card-loading">
      <SkeletonBox height="36px" width="60%" style={{ marginBottom: '8px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '480px' }}>
        <SkeletonBox height="18px" width="95%" />
        <SkeletonBox height="18px" width="70%" />
      </div>
      <SkeletonBox
        height="52px"
        width="140px"
        className="skeleton-pill"
        style={{ marginTop: '12px' }}
      />
    </div>
  );
}

export function CardSideSkeleton() {
  return (
    <div className="card-side glass bento-card-loading">
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SkeletonBox
          width="64px"
          height="64px"
          className="skeleton-circle"
          style={{ marginBottom: '20px' }}
        />
        <SkeletonBox height="22px" width="65%" style={{ marginBottom: '12px' }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <SkeletonBox height="16px" width="80%" />
          <SkeletonBox height="16px" width="55%" />
        </div>
      </div>
    </div>
  );
}

export function CardSmallSkeleton() {
  return (
    <div className="card-small glass bento-card-loading">
      <SkeletonBox
        width="56px"
        height="56px"
        className="skeleton-circle"
        style={{ marginBottom: '8px' }}
      />
      <SkeletonBox height="22px" width="50%" style={{ marginBottom: '4px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SkeletonBox height="16px" width="90%" />
        <SkeletonBox height="16px" width="65%" />
      </div>
    </div>
  );
}
